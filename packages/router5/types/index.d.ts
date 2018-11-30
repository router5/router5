import createRouter from './createRouter'
import RouteNode from 'route-node'
import transitionPath from 'router5-transition-path'
import { constants, errorCodes, ErrorCodes, Constants } from './constants'
import cloneRouter from './clone'
export { Route, ActivationFn, Router, PluginFactory } from './types/router'
export { State } from './types/base'
export {
    createRouter,
    cloneRouter,
    RouteNode,
    transitionPath,
    constants,
    errorCodes,
    ErrorCodes,
    Constants
}
export default createRouter
