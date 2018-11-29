import { PluginFactory } from 'router5'
import { BrowserPluginOptions } from './types'
declare function browserPluginFactory(
    opts?: BrowserPluginOptions,
    browser?: import('./types').Browser
): PluginFactory
export default browserPluginFactory
