import { Subject, Observable } from 'rxjs'
import { Router, State } from 'router5'
import transitionPath from 'router5-transition-path'
import { map, startWith, filter, distinctUntilChanged } from 'rxjs/operators'
import { PluginFactory } from 'router5'

const PLUGIN_NAME = 'RXJS_PLUGIN'
const TRANSITION_SUCCESS = 'success'
const TRANSITION_ERROR = 'error'
const TRANSITION_START = 'start'
const TRANSITION_CANCEL = 'cancel'

export {
    TRANSITION_SUCCESS,
    TRANSITION_ERROR,
    TRANSITION_START,
    TRANSITION_CANCEL
}

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

function rxjsPluginFactory(observer: Subject<RouterAction>): PluginFactory {
    function rxjsPlugin() {
        const dispatch = (type: string, isError = false) => (
            toState: State,
            fromState: State | null,
            error: any
        ) => {
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

    return rxjsPlugin as PluginFactory
}

function createObservables(router: Router) {
    // Events observable
    const transitionEvents$ = new Subject<RouterAction>()

    router.usePlugin(rxjsPluginFactory(transitionEvents$))
    // Transition Route
    const transitionRoute$ = transitionEvents$.pipe(
        map(_ => (_.type === TRANSITION_START ? _.toState : null)),
        startWith(null)
    )

    // Error
    const transitionError$ = transitionEvents$.pipe(
        filter(_ => Boolean(_.type)),
        map(_ => (_.type === TRANSITION_ERROR ? _.error : null)),
        startWith(null),
        distinctUntilChanged()
    )

    // Route with intersection
    const routeState$: Observable<RouterState> = transitionEvents$.pipe(
        filter(_ => _.type === TRANSITION_SUCCESS && _.toState !== null),
        map((action: RouterAction) => {
            const { intersection } = transitionPath(
                action.toState,
                action.fromState
            )
            return { intersection, state: action.toState }
        }),
        startWith<RouterState>({ intersection: '', state: router.getState() })
    )

    // Create a route observable
    const route$: Observable<State> = routeState$.pipe(
        map(({ state }) => state)
    )

    // Create a route node observable
    const routeNode = (node: string): Observable<State> =>
        routeState$.pipe(
            filter<RouterState>(({ intersection }) => intersection === node),
            map<RouterState, State>(({ state }) => state),
            startWith(router.getState() as State)
        )

    // Return observables
    return {
        route$,
        routeNode,
        transitionError$,
        transitionRoute$
    }
}

export default createObservables
