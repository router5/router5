import { PluginFactory } from 'router5'
export interface ListenersPluginOptions {
    autoCleanUp?: boolean
}
declare const listenersPluginFactory: (
    options?: ListenersPluginOptions
) => PluginFactory
export default listenersPluginFactory
