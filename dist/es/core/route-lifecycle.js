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
}