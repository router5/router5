const getDefinedParams = params =>
    Object.keys(params)
        .filter(param => params[param] !== undefined)
        .reduce((acc, param) => ({ ...acc, [param]: params[param] }), {});

function persistentParamsPluginFactory(params = {}) {
    function persistentParamsPlugin(router) {
        // Persistent parameters
        const persistentParams = Array.isArray(params)
            ? params.reduce(
                  (acc, param) => ({ ...acc, [param]: undefined }),
                  {}
              )
            : params;

        const paramNames = Object.keys(persistentParams);
        const hasQueryParams = router.rootNode.path.indexOf('?') !== -1;
        const queryParams = paramNames.join('&');
        const search = queryParams
            ? `${hasQueryParams ? '&' : '?'}${queryParams}`
            : '';

        // Root node path
        const path = router.rootNode.path.split('?')[0] + search;
        router.setRootPath(path);

        const { buildPath, buildState } = router;

        // Decorators
        router.buildPath = function(route, params) {
            const routeParams = {
                ...getDefinedParams(persistentParams),
                ...params
            };
            return buildPath.call(router, route, routeParams);
        };

        router.buildState = function(route, params) {
            const routeParams = {
                ...getDefinedParams(persistentParams),
                ...params
            };
            return buildState.call(router, route, routeParams);
        };

        return {
            onTransitionSuccess(toState) {
                Object.keys(toState.params)
                    .filter(p => paramNames.indexOf(p) !== -1)
                    .forEach(p => (persistentParams[p] = toState.params[p]));
            }
        };
    }

    persistentParamsPlugin.pluginName = 'PERSISTENT_PARAMS_PLUGIN';

    return persistentParamsPlugin;
}

export default persistentParamsPluginFactory;
