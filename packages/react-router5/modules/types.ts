import { Router, State } from 'router5'

export type RouteContext = {
    router: Router
} & RouterState

export interface RouterState {
    route: State
    previousRoute: State | null
}

export type UnsubscribeFn = () => void
