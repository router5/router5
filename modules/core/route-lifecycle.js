import constants from '../constants';

const toFunction = (val) => typeof val === 'function' ? val : () => () => val;

export default function withRouteLifecycle(router) {
    let canActivateFactories = {};
    let canActivateFunctions = {};
    let canDeactivateFactories = {};
    let canDeactivateFunctions = {};

    router.canDeactivate = canDeactivate;
    router.canActivate = canActivate;
    router.getLifecycleFunctions = getLifecycleFunctions;
    router.clearCanDeactivate = clearCanDeactivate;

    function getLifecycleFunctions() {
        return [ canDeactivateFunctions, canActivateFunctions ];
    }

    function canDeactivate(name, canDeactivateHandler) {
        const factory = toFunction(canDeactivateHandler);

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
        const factory = toFunction(canActivateHandler);
        canActivateFactories[name] = factory;

        if (router.isStarted()) {
            canActivateFunctions[name] = router.executeFactory(factory);
        }

        return router;
    }

    function executeFactories() {
        const reduceFactories = (factories) => Object.keys(factories).reduce(
            (functionsMap, key) => {
                if (factories[key]) {
                    functionsMap[key] = router.executeFactory(factories[key]);
                }
                return functionsMap;
            },
            {}
        );

        canActivateFunctions = reduceFactories(canActivateFactories);
        canDeactivateFunctions = reduceFactories(canDeactivateFactories);
    }

    router.addListener(constants.ROUTER_START, executeFactories);
}
