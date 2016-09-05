const toFunction = (val) => typeof val === 'function' ? val : () => () => val;

export default function withRouteLifecycle(router) {
    let canDeactivateFunctions = {};
    let canActivateFunctions = {};

    router.canDeactivate = canDeactivate;
    router.canActivate = canActivate;
    router.getLifecycleFunctions = getLifecycleFunctions;
    router.clearCanDeactivate = clearCanDeactivate;

    function getLifecycleFunctions() {
        return [ canDeactivateFunctions, canActivateFunctions ];
    }

    function canDeactivate(name, canDeactivateHandler) {
        const factory = toFunction(canDeactivateHandler);

        canDeactivateFunctions[name] = router.executeFactory(factory);
        return router;
    }

    function clearCanDeactivate(name) {
        canDeactivateFunctions[name] = undefined;
    }

    function canActivate(name, canActivateHandler) {
        const factory = toFunction(canActivateHandler);

        canActivateFunctions[name] = router.executeFactory(factory);
        return router;
    }
}
