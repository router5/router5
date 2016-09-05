import constants from '../constants';

var toFunction = function toFunction(val) {
    return typeof val === 'function' ? val : function () {
        return function () {
            return val;
        };
    };
};

export default function withRouteLifecycle(router) {
    var canActivateFactories = {};
    var canActivateFunctions = {};
    var canDeactivateFactories = {};
    var canDeactivateFunctions = {};

    router.canDeactivate = canDeactivate;
    router.canActivate = canActivate;
    router.getLifecycleFunctions = getLifecycleFunctions;
    router.clearCanDeactivate = clearCanDeactivate;

    function getLifecycleFunctions() {
        return [canDeactivateFunctions, canActivateFunctions];
    }

    function canDeactivate(name, canDeactivateHandler) {
        var factory = toFunction(canDeactivateHandler);

        canDeactivateFactories[name] = factory;

        if (router.isStarted()) {
            canDeactivateFunctions[name] = router.executeFactory(factory);
        }

        return router;
    }

    function clearCanDeactivate(name) {
        canDeactivateFactories[name] = undefined;
        canDeactivateFunctions[name] = undefined;
    }

    function canActivate(name, canActivateHandler) {
        var factory = toFunction(canActivateHandler);
        canActivateFactories[name] = factory;

        if (router.isStarted()) {
            canActivateFunctions[name] = router.executeFactory(factory);
        }

        return router;
    }

    function executeFactories() {
        var reduceFactories = function reduceFactories(factories) {
            return Object.keys(factories).reduce(function (functionsMap, key) {
                if (factories[key]) {
                    functionsMap[key] = router.executeFactory(factories[key]);
                }
                return functionsMap;
            }, {});
        };

        canActivateFunctions = reduceFactories(canActivateFactories);
        canDeactivateFunctions = reduceFactories(canDeactivateFactories);
    }

    router.addEventListener(constants.ROUTER_START, executeFactories);
}