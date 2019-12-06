import { PluginFactory, State } from 'router5'
import { BrowserPluginOptions, Browser } from './types'
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
    browser?: Browser
): PluginFactory
export default browserPluginFactory
