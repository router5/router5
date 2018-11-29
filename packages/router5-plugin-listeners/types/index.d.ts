export interface ListenersPluginOptions {
    autoCleanUp?: boolean
}
declare const listenersPluginFactory: (
    options?: ListenersPluginOptions
) => {
    (router: any): any
    pluginName: string
}
export default listenersPluginFactory
