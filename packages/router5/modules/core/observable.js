import $$observable from 'symbol-observable'

function observerPlugin(router) {
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
    router[$$observable] = observable

    return {
        onTransitionSuccess: (toState, fromState) => {
            listeners.forEach(listener =>
                listener({
                    route: toState,
                    previousRoute: fromState
                })
            )
        }
    }
}

observerPlugin.pluginName = 'OBSERVABLE_PLUGIN'

export default function withObservablePlugin(router) {
    router.usePlugin(observerPlugin)
}
