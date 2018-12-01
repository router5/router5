import $$observable from 'symbol-observable'
import { Router } from '../types/router'
import { constants } from '../constants'

export default function withObservable(router: Router) {
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
