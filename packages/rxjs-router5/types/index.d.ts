import { Observable } from 'rxjs'
import { Router, State } from 'router5'
export declare const PLUGIN_NAME = 'RXJS_PLUGIN'
export declare const TRANSITION_SUCCESS = 'success'
export declare const TRANSITION_ERROR = 'error'
export declare const TRANSITION_START = 'start'
export declare const TRANSITION_CANCEL = 'cancel'
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
declare function createObservables(
    router: Router
): {
    route$: Observable<State>
    routeNode: (node: string) => Observable<State>
    transitionError$: Observable<any>
    transitionRoute$: Observable<State>
}
export default createObservables
