var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getDefinedParams = function getDefinedParams(params) {
    return Object.keys(params).filter(function (param) {
        return params[param] !== undefined;
    }).reduce(function (acc, param) {
        return _extends({}, acc, _defineProperty({}, param, params[param]));
    }, {});
};

function persistentParamsPluginFactory() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function persistentParamsPlugin(router) {
        // Persistent parameters
        var persistentParams = Array.isArray(params) ? params.reduce(function (acc, param) {
            return _extends({}, acc, _defineProperty({}, param, undefined));
        }, {}) : params;

        var paramNames = Object.keys(persistentParams);
        var hasQueryParams = router.rootNode.path.indexOf('?') !== -1;
        var queryParams = paramNames.join('&');
        var search = queryParams ? '' + (hasQueryParams ? '&' : '?') + queryParams : '';

        // Root node path
        var path = router.rootNode.path.split('?')[0] + search;
        router.setRootPath(path);

        var buildPath = router.buildPath,
            buildState = router.buildState;

        // Decorators

        router.buildPath = function (route, params) {
            var routeParams = _extends({}, getDefinedParams(persistentParams), params);
            return buildPath.call(router, route, routeParams);
        };

        router.buildState = function (route, params) {
            var routeParams = _extends({}, getDefinedParams(persistentParams), params);
            return buildState.call(router, route, routeParams);
        };

        return {
            onTransitionSuccess: function onTransitionSuccess(toState) {
                Object.keys(toState.params).filter(function (p) {
                    return paramNames.indexOf(p) !== -1;
                }).forEach(function (p) {
                    return persistentParams[p] = toState.params[p];
                });
            }
        };
    }

    persistentParamsPlugin.pluginName = 'PERSISTENT_PARAMS_PLUGIN';

    return persistentParamsPlugin;
}

export default persistentParamsPluginFactory;