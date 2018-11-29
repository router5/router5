import createRouter from './createRouter'
import RouteNode from 'route-node'
import transitionPath from 'router5-transition-path'
import { constants, errorCodes } from './constants'
import cloneRouter from './clone'
export { Route, ActivationFn, Router } from './types/router'
export { State } from './types/base'
export {
    createRouter,
    cloneRouter,
    RouteNode,
    transitionPath,
    constants,
    errorCodes
}
export default createRouter
