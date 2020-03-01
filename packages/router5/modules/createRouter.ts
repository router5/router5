import { Router, Route, Options, DefaultDependencies } from './types/router'

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
import { RouteNode } from 'route-node'

type Enhancer<Dependencies> = (
    router: Router<Dependencies>
) => Router<Dependencies>

const pipe = <Dependencies>(...fns: Array<Enhancer<Dependencies>>) => (
    arg: Router<Dependencies>
): Router<Dependencies> =>
    fns.reduce((prev: Router<Dependencies>, fn) => fn(prev), arg)

const createRouter = <
    Dependencies extends DefaultDependencies = DefaultDependencies
>(
    routes: Array<Route<Dependencies>> | RouteNode = [],
    options: Partial<Options> = {},
    dependencies: Dependencies = {} as Dependencies
): Router<Dependencies> => {
    const config = {
        decoders: {},
        encoders: {},
        defaultParams: {},
        forwardMap: {}
    }

    return pipe<Dependencies>(
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
    )({ config } as Router<Dependencies>)
}

export default createRouter
