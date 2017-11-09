const toFunction = val => (typeof val === 'function' ? val : () => () => val)

export default function withRouteLifecycle(router) {
    let canDeactivateFactories = {}
    let canActivateFactories = {}
    let canDeactivateFunctions = {}
    let canActivateFunctions = {}

    router.canDeactivate = canDeactivate
    router.canActivate = canActivate
    router.getLifecycleFactories = getLifecycleFactories
    router.getLifecycleFunctions = getLifecycleFunctions
    router.clearCanDeactivate = clearCanDeactivate

    function getLifecycleFactories() {
        return [canDeactivateFactories, canActivateFactories]
    }

    function getLifecycleFunctions() {
        return [canDeactivateFunctions, canActivateFunctions]
    }

    /**
     * Register a canDeactivate handler or specify a if a route can be deactivated
     * @param  {String} name                           The route name
     * @param  {Function|Boolean} canDeactivateHandler The canDeactivate handler or boolean
     * @return {Object}                                The router instance
     */
    function canDeactivate(name, canDeactivateHandler) {
        const factory = toFunction(canDeactivateHandler)

        canDeactivateFactories[name] = factory
        canDeactivateFunctions[name] = router.executeFactory(factory)

        return router
    }

    /**
     * Remove a canDeactivate handler for a route
     * @param  {String} name The route name
     * @return {Object}      The router instance
     */
    function clearCanDeactivate(name) {
        canDeactivateFactories[name] = undefined
        canDeactivateFunctions[name] = undefined

        return router
    }

    /**
     * Register a canActivate handler or specify a if a route can be deactivated
     * @param  {String} name                         The route name
     * @param  {Function|Boolean} canActivateHandler The canActivate handler or boolean
     * @return {Object}                              The router instance
     */
    function canActivate(name, canActivateHandler) {
        const factory = toFunction(canActivateHandler)

        canActivateFactories[name] = factory
        canActivateFunctions[name] = router.executeFactory(factory)

        return router
    }
}
