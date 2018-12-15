export interface NavigationOptions {
    replace?: boolean
    reload?: boolean
    skipTransition?: boolean
    force?: boolean
    [key: string]: any
}
export declare type Params = Record<string, any>
export declare type Unsubscribe = () => void
export declare type DoneFn = (err?: any, state?: State) => void
export declare type CancelFn = () => void
export interface StateMeta {
    id: number
    params: Params
    options: NavigationOptions
    redirected: Boolean
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
