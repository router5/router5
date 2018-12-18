import xs from 'xstream'
import { State } from 'router5'
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
    router: any
): {
    route$: import('xstream').MemoryStream<State>
    routeNode: (node: string) => import('xstream').MemoryStream<State>
    transitionError$: xs<any>
    transitionRoute$: import('xstream').MemoryStream<State>
}
export default createObservables
