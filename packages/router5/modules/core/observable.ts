import $$observable from 'symbol-observable'
import { Router } from '../types/router'
import { constants } from '../constants'

export default function withObservability<Dependencies>(
    router: Router<Dependencies>
): Router<Dependencies> {
    const callbacks = {}

    router.invokeEventListeners = (eventName, ...args) => {
        ;(callbacks[eventName] || []).forEach(cb => cb(...args))
    }

    router.removeEventListener = (eventName, cb) => {
        callbacks[eventName] = callbacks[eventName].filter(_cb => _cb !== cb)
    }

    router.addEventListener = (eventName, cb) => {
        callbacks[eventName] = (callbacks[eventName] || []).concat(cb)

        return () => router.removeEventListener(eventName, cb)
    }

    function subscribe(listener) {
        const isObject = typeof listener === 'object'
        const finalListener = isObject ? listener.next.bind(listener) : listener
        const unsubscribeHandler = router.addEventListener(
            constants.TRANSITION_SUCCESS,
            (toState, fromState) => {
                finalListener({
                    route: toState,
                    previousRoute: fromState
                })
            }
        )

        return isObject
            ? { unsubscribe: unsubscribeHandler }
            : unsubscribeHandler
    }

    function observable() {
        return {
            subscribe(observer) {
                if (typeof observer !== 'object' || observer === null) {
                    throw new TypeError(
                        'Expected the observer to be an object.'
                    )
                }
                return subscribe(observer)
            },

            [$$observable]() {
                return this
            }
        }
    }

    router.subscribe = subscribe
    //@ts-ignore
    router[$$observable] = observable
    //@ts-ignore
    router['@@observable'] = observable

    return router
}
