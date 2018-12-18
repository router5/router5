import { PluginFactory, State } from 'router5'
import { BrowserPluginOptions } from './types'
declare module 'router5/types/types/router' {
    interface Router {
        buildUrl(
            name: string,
            params?: {
                [key: string]: any
            }
        ): string
        matchUrl(url: string): State | null
        replaceHistoryState(
            name: string,
            params?: {
                [key: string]: any
            },
            title?: string
        ): void
        lastKnownState: State
    }
}
declare function browserPluginFactory(
    opts?: BrowserPluginOptions,
    browser?: import('./types').Browser
): PluginFactory
export default browserPluginFactory
