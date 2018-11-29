import $$observable from 'symbol-observable'
import { Router } from '../types/router'
import { constants } from '../constants'

export default function withObservable(router: Router) {
    let listeners = []

    function unsubscribe(listener) {
        if (listener) {
            listeners = listeners.filter(l => l !== listener)
        }
    }

    function subscribe(listener) {
        const isObject = typeof listener === 'object'
        const finalListener = isObject ? listener.next.bind(listener) : listener

        listeners = listeners.concat(finalListener)

        const unsubscribeHandler = () => unsubscribe(finalListener)

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

    router.addEventListener(
        constants.TRANSITION_SUCCESS,
        (toState, fromState) => {
            listeners.forEach(listener =>
                listener({
                    route: toState,
                    previousRoute: fromState
                })
            )
        }
    )

    return router
}
