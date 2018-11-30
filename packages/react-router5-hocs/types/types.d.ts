import { Router, State } from 'router5'
export declare type RouterState = {
    router: Router
} & RouteState
export interface RouteState {
    route: State
    previousRoute: State | null
}
export declare type UnsubscribeFn = () => void
