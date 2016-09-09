var toFunction = function toFunction(val) {
    return typeof val === 'function' ? val : function () {
        return function () {
            return val;
        };
    };
};

export default function withRouteLifecycle(router) {
    var canDeactivateFunctions = {};
    var canActivateFunctions = {};

    router.canDeactivate = canDeactivate;
    router.canActivate = canActivate;
    router.getLifecycleFunctions = getLifecycleFunctions;
    router.clearCanDeactivate = clearCanDeactivate;
    router.addNode = addNode;

    function getLifecycleFunctions() {
        return [canDeactivateFunctions, canActivateFunctions];
    }

    function canDeactivate(name, canDeactivateHandler) {
        var factory = toFunction(canDeactivateHandler);

        canDeactivateFunctions[name] = router.executeFactory(factory);
        return router;
    }

    function clearCanDeactivate(name) {
        canDeactivateFunctions[name] = undefined;
    }

    function canActivate(name, canActivateHandler) {
        var factory = toFunction(canActivateHandler);

        canActivateFunctions[name] = router.executeFactory(factory);
        return router;
    }

    /**
     * Add a single route (node)
     * @param {String} name                  The route name (full name)
     * @param {String} path                  The route path (from parent)
     * @param {Function=} canActivateHandler The canActivate handler for this node
     */
    function addNode(name, path, canActivateHandler) {
        router.rootNode.addNode(name, path);
        if (canActivateHandler) router.canActivate(name, canActivateHandler);
        return router;
    }
}