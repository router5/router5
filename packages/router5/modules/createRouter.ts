import { Router, CreateRouter } from './types/router'

import withOptions from './core/options'
import withRoutes from './core/routes'
import withDependencies from './core/dependencies'
import withState from './core/state'
import withPlugins from './core/plugins'
import withMiddleware from './core/middleware'
import withObservability from './core/observable'
import withNavigation from './core/navigation'
import withRouterLifecycle from './core/routerLifecycle'
import withRouteLifecycle from './core/routeLifecycle'

type Enhancer = (router: Router) => Router
const pipe = (...fns: Array<Enhancer>) => (arg: Router): Router =>
    fns.reduce((prev: Router, fn) => fn(prev), arg)

const createRouter: CreateRouter = (
    routes?,
    options?,
    dependencies?
): Router => {
    const config = {
        decoders: {},
        encoders: {},
        defaultParams: {},
        forwardMap: {}
    }

    return pipe(
        withOptions(options),
        withDependencies(dependencies),
        withObservability,
        withState,
        withRouterLifecycle,
        withRouteLifecycle,
        withNavigation,
        withPlugins,
        withMiddleware,
        withRoutes(routes)
    )({ config } as Router)
}

export default createRouter
