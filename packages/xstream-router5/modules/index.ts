import xs, { Listener } from 'xstream'
import { State, PluginFactory } from 'router5'
import dropRepeats from 'xstream/extra/dropRepeats'
import transitionPath from 'router5-transition-path'

export const TRANSITION_SUCCESS = 'success'
export const TRANSITION_ERROR = 'error'
export const TRANSITION_START = 'start'
export const TRANSITION_CANCEL = 'cancel'

export interface RouterAction {
    type: string
    toState: State
    fromState: State | null
    error?: any
}

export interface RouterState {
    intersection: ''
    state: State
}

function xsPluginFactory(listener: Listener<RouterAction>): PluginFactory {
    function xsPlugin() {
        const dispatch = (type: string, isError?: boolean) => (
            toState: State,
            fromState: State | null,
            error: any
        ) => {
            if (listener) {
                const routerEvt = { type, toState, fromState }

                listener.next(isError ? { ...routerEvt, error } : routerEvt)
            }
        }

        return {
            onStop: () => listener.complete(),
            onTransitionSuccess: dispatch(TRANSITION_SUCCESS),
            onTransitionError: dispatch(TRANSITION_ERROR, true),
            onTransitionStart: dispatch(TRANSITION_START),
            onTransitionCancel: dispatch(TRANSITION_CANCEL)
        }
    }

    return xsPlugin as PluginFactory
}

function createObservables(router) {
    // Events observable
    const transitionEvents$ = xs.create<RouterAction>({
        start(listener) {
            router.usePlugin(xsPluginFactory(listener))
        },
        stop() {}
    })

    // Transition Route
    const transitionRoute$ = transitionEvents$
        .map<State | null>(_ =>
            _.type === TRANSITION_START ? _.toState : null
        )
        .startWith(null)

    // Error
    const transitionError$ = transitionEvents$
        .filter(_ => Boolean(_.type))
        .map<any>(_ => (_.type === TRANSITION_ERROR ? _.error : null))
        .startWith(null)
        .compose(dropRepeats())

    // Route with intersection
    const routeState$ = transitionEvents$
        .filter(_ => _.type === TRANSITION_SUCCESS && _.toState !== null)
        .map<RouterState>(({ toState, fromState }) => {
            const { intersection } = transitionPath(toState, fromState)
            return { intersection, state: toState } as RouterState
        })
        .startWith({ intersection: '', state: router.getState() })

    // Create a route observable
    const route$ = routeState$.map<State>(({ state }) => state)

    // Create a route node observable
    const routeNode = (node: string) =>
        routeState$
            .filter(({ intersection }) => intersection === node)
            .map(({ state }) => state)
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
