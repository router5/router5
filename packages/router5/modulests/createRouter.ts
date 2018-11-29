import { Router, CreateRouter } from './types/router'

import withOptions from './core/options'
import withRoutes from './core/routes'
import withDependencies from './core/dependencies'
import withCloning from './core/clone'
import withState from './core/state'
import withPlugins from './core/plugins'
import withMiddleware from './core/middleware'
import withNavigation from './core/navigation'
import withObservable from './core/observable'
import withRouterLifecycle from './core/routerLifecycle'
import withRouteLifecycle from './core/routeLifecycle'
import withEvents from './core/events'

type Enhancer = (router: Router) => Router
const pipe = (...fns: Array<Enhancer>) => (arg: Router): Router =>
    fns.reduce((prev: Router, fn) => fn(prev), arg)

const createRouter: CreateRouter = (
    routes,
    options?,
    dependencies?
): Router => {
    return pipe(
        withOptions(options),
        withRoutes(routes),
        withDependencies(dependencies),
        withState,
        withEvents,
        withRouterLifecycle,
        withRouteLifecycle,
        withNavigation,
        withObservable,
        withPlugins,
        withMiddleware,
        withCloning(createRouter)
    )({} as Router)
}

export default createRouter
