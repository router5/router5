declare module 'redux-router5' {
    import { Router, PluginFactory, State, Route } from 'router5'
    import { Store, Middleware, Reducer, Dispatch, Action } from 'redux'

    export function router5Middleware(router: Router): Middleware

    export interface RouterState {
        route: State | null
        previousRoute: State | null
        transitionRoute: State | null
        transitionError: any | null
    }

    export const router5Reducer: Reducer<RouterState>

    interface TransitionState {
        type: string
        payload?: {
            route: State
            previousRoute?: State
            transitionError?: any
        }
    }

    export function reduxPlugin<TState extends TransitionState>(
        dispatch: Dispatch<TState>
    ): PluginFactory

    export function createRouteNodeSelector<
        TState extends { router: RouterState }
    >(routeNode: string, reducerKey?: string): (state: TState) => RouterState

    // #region actions

    const NAVIGATE_TO = '@@router5/NAVIGATE'
    const CANCEL_TRANSITION = '@@router5/CANCEL'
    const TRANSITION_ERROR = '@@router5/TRANSITION_ERROR'
    const TRANSITION_SUCCESS = '@@router5/TRANSITION_SUCCESS'
    const TRANSITION_START = '@@router5/TRANSITION_START'
    const CLEAR_ERRORS = '@@router5/CLEAR_ERRORS'
    const CAN_DEACTIVATE = '@@router5/CAN_DEACTIVATE'
    const CAN_ACTIVATE = '@@router5/CAN_ACTIVATE'

    export const actionTypes: {
        NAVIGATE_TO: typeof NAVIGATE_TO
        CANCEL_TRANSITION: typeof CANCEL_TRANSITION
        TRANSITION_ERROR: typeof TRANSITION_ERROR
        TRANSITION_SUCCESS: typeof TRANSITION_SUCCESS
        TRANSITION_START: typeof TRANSITION_START
        CLEAR_ERRORS: typeof CLEAR_ERRORS
        CAN_DEACTIVATE: typeof CAN_DEACTIVATE
        CAN_ACTIVATE: typeof CAN_ACTIVATE
    }

    export interface ActionNavigateTo extends Action {
        type: typeof NAVIGATE_TO
        payload: {
            name: string
            params: any
            opts: any
        }
    }

    export interface ActionCancelTransition extends Action {
        type: typeof CANCEL_TRANSITION
    }

    export interface ActionClearErrors extends Action {
        type: typeof CLEAR_ERRORS
    }

    export interface ActionTransitionStart extends Action {
        type: typeof TRANSITION_START
        payload: {
            route: State
            previousRoute: State
        }
    }

    export interface ActionTransitionSuccess extends Action {
        type: typeof TRANSITION_SUCCESS
        payload: {
            route: State
            previousRoute: State
        }
    }

    export interface ActionTransitionError extends Action {
        type: typeof TRANSITION_ERROR
        payload: {
            route: State
            previousRoute: State
            transitionError: any
        }
    }

    export interface ActionCanActivate extends Action {
        type: typeof CAN_ACTIVATE
        payload: {
            name: string
            canActivate: boolean
        }
    }

    export interface ActionCanDeactivate extends Action {
        type: typeof CAN_DEACTIVATE
        payload: {
            name: string
            canDeactivate: boolean
        }
    }

    export const actions: {
        navigateTo(name: string, params?: any, opts?: any): ActionNavigateTo
        cancelTransition(): ActionCancelTransition
        clearErrors(): ActionClearErrors
        transitionStart(
            route: State,
            previousRoute: State
        ): ActionTransitionStart
        transitionSuccess(
            route: State,
            previousRoute: State
        ): ActionTransitionSuccess
        transitionError(
            route: State,
            previousRoute: State,
            transitionError: any
        ): ActionTransitionError
        canActivate(name: string, canActivate: boolean): ActionCanActivate
        canDeactivate(name: string, canDeactivate: boolean): ActionCanDeactivate
    }

    // #endregion
}

declare module 'redux-router5/immutable/reducer' {
    import { Reducer } from 'redux'
    import { RouterState } from 'redux-router5'

    const router5Reducer: Reducer<RouterState>
    export default router5Reducer
}
