import createRouter from './create-router'
import RouteNode from 'route-node'
import loggerPlugin from './plugins/logger'
import transitionPath from 'router5-transition-path'
import constants, { errorCodes } from './constants'

export default createRouter

export {
    createRouter,
    RouteNode,
    loggerPlugin,
    errorCodes,
    transitionPath,
    constants
}
