import { Observable, Subscriber } from 'rxjs'
import { Router, State } from 'router5'
import transitionPath from 'router5-transition-path'
import {
    map,
    startWith,
    filter,
    distinctUntilChanged,
    share
} from 'rxjs/operators'
import { PluginFactory } from 'router5'

export const PLUGIN_NAME = 'RXJS_PLUGIN'
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

function rxjsPluginFactory(observer: Subscriber<RouterAction>): PluginFactory {
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

    return rxjsPlugin as PluginFactory
}

function createObservables(router: Router) {
    // Events observable
    const transitionEvents$ = new Observable<RouterAction>(observer => {
        const unsubscribe = router.usePlugin(rxjsPluginFactory(observer))

        return unsubscribe
    }).pipe(share<RouterAction>())

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
