export interface NavigationOptions {
    replace?: boolean
    reload?: boolean
    skipTransition?: boolean
    force?: boolean
    [key: string]: any
}

export type Params = Record<string, any>

export type Unsubscribe = () => void

export type DoneFn = (err?: any, state?: State) => void

export type CancelFn = () => void

export interface StateMeta {
    id: number
    params: Params
    options: NavigationOptions
    redirected: boolean
    source?: string
}

export interface SimpleState {
    name: string
    params: Params
}

export interface State {
    name: string
    params: Params
    path: string
    meta?: StateMeta
}
