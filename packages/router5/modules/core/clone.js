export default function withCloning(router, createRouter) {
    return {
        clone(deps = {}) {
            const clonedDependencies = { ...router.getDependencies(), ...deps }
            const clonedRouter = createRouter(
                router.rootNode,
                router.getOptions(),
                clonedDependencies
            )

            clonedRouter.useMiddleware(...router.getMiddlewareFactories())
            clonedRouter.usePlugin(...router.getPlugins())
            clonedRouter.config = router.config

            const [
                canDeactivateFactories,
                canActivateFactories
            ] = router.getLifecycleFactories()

            Object.keys(canDeactivateFactories).forEach(name =>
                clonedRouter.canDeactivate(name, canDeactivateFactories[name])
            )
            Object.keys(canActivateFactories).forEach(name =>
                clonedRouter.canActivate(name, canActivateFactories[name])
            )

            return clonedRouter
        }
    }
}
