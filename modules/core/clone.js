export default function withCloning(router, createRouter) {
    router.clone = clone;

    /**
     * Clone the current router configuration. The new returned router will be non-started,
     * with a null state
     * @param  {[type]} deps [description]
     * @return {[type]}      [description]
     */
    function clone(deps = {}) {
        const clonedDependencies = { ...router.getDependencies(), ...deps };
        const clonedRouter = createRouter(router.rootNode, router.getOptions(), clonedDependencies);

        clonedRouter.useMiddleware(...router.getMiddlewareFactories());
        clonedRouter.usePlugin(...router.getPlugins());

        const [ canDeactivateFactories, canActivateFactories ] = router.getLifecycleFactories();

        Object.keys(canDeactivateFactories)
            .forEach((name) => clonedRouter.canDeactivate(name, canDeactivateFactories[name]));
        Object.keys(canActivateFactories)
            .forEach((name) => clonedRouter.canActivate(name, canActivateFactories[name]));

        return clonedRouter;
    }
};
