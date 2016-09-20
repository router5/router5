export default function withCloning(router, createRouter) {
    router.clone = clone;

    /**
     * Clone the current router configuration. The new returned router will be non-started,
     * with a null state
     * @param  {[type]} deps [description]
     * @return {[type]}      [description]
     */
    function clone() {
        var deps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var clonedDependencies = babelHelpers.extends({}, router.getDependencies(), deps);
        var clonedRouter = createRouter(router.rootNode, router.getOptions(), clonedDependencies);

        clonedRouter.useMiddleware.apply(clonedRouter, babelHelpers.toConsumableArray(router.getMiddlewareFactories()));
        clonedRouter.usePlugin.apply(clonedRouter, babelHelpers.toConsumableArray(router.getPlugins()));

        var _router$getLifecycleF = router.getLifecycleFactories();

        var _router$getLifecycleF2 = babelHelpers.slicedToArray(_router$getLifecycleF, 2);

        var canDeactivateFactories = _router$getLifecycleF2[0];
        var canActivateFactories = _router$getLifecycleF2[1];


        Object.keys(canDeactivateFactories).forEach(function (name) {
            return clonedRouter.canDeactivate(name, canDeactivateFactories[name]);
        });
        Object.keys(canActivateFactories).forEach(function (name) {
            return clonedRouter.canActivate(name, canActivateFactories[name]);
        });

        return clonedRouter;
    }
};