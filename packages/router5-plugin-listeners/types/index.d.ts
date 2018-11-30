import { PluginFactory, State } from 'router5'
export declare type Listener = (toState: State, fromState: State | null) => void
declare module 'router5/types/types/router' {
    interface Router {
        getListeners(): {
            [key: string]: Listener[]
        }
        addListener(name: string, callback: Listener): void
        removeListener(name: string, callback: Listener): void
        addNodeListener(name: string, callback: Listener): void
        removeNodeListener(name: string, callback: Listener): void
        addRouteListener(name: string, callback: Listener): void
        removeRouteListener(name: string, callback: Listener): void
    }
}
export interface ListenersPluginOptions {
    autoCleanUp?: boolean
}
declare const listenersPluginFactory: (
    options?: ListenersPluginOptions
) => PluginFactory
export default listenersPluginFactory
