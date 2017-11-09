import Rx from 'rxjs'
import transitionPath from 'router5-transition-path'

const PLUGIN_NAME = 'RXJS_PLUGIN'
const TRANSITION_SUCCESS = '@@router5/TRANSITION_SUCCESS'
const TRANSITION_ERROR = '@@router5/TRANSITION_ERROR'
const TRANSITION_START = '@@router5/TRANSITION_START'
const TRANSITION_CANCEL = '@@router5/TRANSITION_CANCEL'

export {
    TRANSITION_SUCCESS,
    TRANSITION_ERROR,
    TRANSITION_START,
    TRANSITION_CANCEL
}

function rxjsPluginFactory(observer) {
    function rxjsPlugin() {
        const dispatch = (type, isError) => (toState, fromState, error) => {
            if (observer) {
                const routerEvt = { type, toState, fromState }

                observer.next(isError ? { ...routerEvt, error } : routerEvt)
            }
        }

        return {
            onStop: () => observer.complete(),
            onTransitionSuccess: dispatch(TRANSITION_SUCCESS),
            onTransitionError: dispatch(TRANSITION_ERROR, true),
            onTransitionStart: dispatch(TRANSITION_START),
            onTransitionCancel: dispatch(TRANSITION_CANCEL)
        }
    }

    rxjsPlugin.pluginName = PLUGIN_NAME

    return rxjsPlugin
}

function createObservables(router) {
    // Events observable
    const transitionEvents$ = Rx.Observable.create(observer => {
        router.usePlugin(rxjsPluginFactory(observer))
    })
        .publish()
        .refCount()

    // Transition Route
    const transitionRoute$ = transitionEvents$
        .map(_ => (_.type === TRANSITION_START ? _.toState : null))
        .startWith(null)

    // Error
    const transitionError$ = transitionEvents$
        .filter(_ => _.type)
        .map(_ => (_.type === TRANSITION_ERROR ? _.error : null))
        .startWith(null)
        .distinctUntilChanged()

    // Route with intersection
    const routeState$ = transitionEvents$
        .filter(_ => _.type === TRANSITION_SUCCESS && _.toState !== null)
        .map(({ toState, fromState }) => {
            const { intersection } = transitionPath(toState, fromState)
            return { intersection, route: toState }
        })
        .startWith({ intersection: '', route: router.getState() })

    // Create a route observable
    const route$ = routeState$.map(({ route }) => route)

    // Create a route node observable
    const routeNode = node =>
        routeState$
            .filter(({ intersection }) => intersection === node)
            .map(({ route }) => route)
            .startWith(router.getState())

    // Return observables
    return {
        route$,
        routeNode,
        transitionError$,
        transitionRoute$
    }
}

export default createObservables
