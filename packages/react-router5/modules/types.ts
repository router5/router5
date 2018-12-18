import { Router, State } from 'router5'

export type RouteContext = {
    router: Router
} & RouteState

export interface RouteState {
    route: State
    previousRoute: State | null
}

export type UnsubscribeFn = () => void
