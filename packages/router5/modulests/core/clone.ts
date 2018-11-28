import { RouterWithCloning, Router, CreateRouter } from '../types/router'

export default function withCloning(createRouter: CreateRouter) {
    return (router: Router): Router => {
        router.clone = dependencies => {
            const clonedDependencies = {
                ...router.getDependencies(),
                ...dependencies
            }
            const clonedRouter = createRouter(
                router.rootNode,
                router.getOptions(),
                clonedDependencies
            )

            // clonedRouter.useMiddleware(...router.getMiddlewareFactories())
            // clonedRouter.usePlugin(...router.getPlugins())
            // clonedRouter.config = router.config

            // const [
            //     canDeactivateFactories,
            //     canActivateFactories
            // ] = router.getLifecycleFactories()

            // Object.keys(canDeactivateFactories).forEach(name =>
            //     clonedRouter.canDeactivate(name, canDeactivateFactories[name])
            // )
            // Object.keys(canActivateFactories).forEach(name =>
            //     clonedRouter.canActivate(name, canActivateFactories[name])
            // )

            return clonedRouter
        }

        return router
    }
}
