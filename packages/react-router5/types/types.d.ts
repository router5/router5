import { Router, State } from 'router5'
export interface RouterContext {
    router: Router
    route: State
    previousRoute: State | null
}
export interface RouterState {
    route: State
    previousRoute: State | null
}
export declare type UnsubscribeFn = () => void
