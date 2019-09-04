import { State } from 'router5'
import { Reducer } from 'redux'

export interface RouterState {
    route: State | null
    previousRoute: State | null
    transitionRoute: State | null
    transitionError: any | null
}

export const router5Reducer: Reducer<RouterState>
