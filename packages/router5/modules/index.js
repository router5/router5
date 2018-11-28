import createRouter from './create-router'
import RouteNode from 'route-node'
import transitionPath from 'router5-transition-path'
import constants, { errorCodes } from './constants'
import loggerPlugin from './plugins/logger'
import browserPlugin from './plugins/browser'
import listenersPlugin from './plugins/listeners'
import persistentParamsPlugin from './plugins/persistentParams'

export default createRouter

export {
    createRouter,
    RouteNode,
    errorCodes,
    transitionPath,
    constants,
    loggerPlugin,
    browserPlugin,
    listenersPlugin,
    persistentParamsPlugin
}
