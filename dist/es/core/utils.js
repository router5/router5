export default function withUtils(router) {
    var options = router.getOptions();

    router.isActive = isActive;
    router.areStatesEqual = areStatesEqual;
    router.areStatesDescendants = areStatesDescendants;
    router.buildPath = buildPath;
    router.buildState = buildState;
    router.matchPath = matchPath;
    router.setRootPath = setRootPath;

    function isActive(name) {
        var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var strictEquality = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var ignoreQueryParams = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

        var activeState = router.getState();

        if (!activeState) return false;

        if (strictEquality || activeState.name === name) {
            return areStatesEqual(router.makeState(name, params), activeState, ignoreQueryParams);
        }

        return areStatesDescendants(router.makeState(name, params), activeState);
    }

    function areStatesEqual(state1, state2) {
        var ignoreQueryParams = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        if (state1.name !== state2.name) return false;

        var getUrlParams = function getUrlParams(name) {
            return router.rootNode.getSegmentsByName(name).map(function (segment) {
                return segment.parser[ignoreQueryParams ? 'urlParams' : 'params'];
            }).reduce(function (params, p) {
                return params.concat(p);
            }, []);
        };

        var state1Params = getUrlParams(state1.name);
        var state2Params = getUrlParams(state2.name);

        return state1Params.length === state2Params.length && state1Params.every(function (p) {
            return state1.params[p] === state2.params[p];
        });
    }

    function areStatesDescendants(parentState, childState) {
        var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
        if (!regex.test(childState.name)) return false;
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(function (p) {
            return parentState.params[p] === childState.params[p];
        });
    }

    function buildPath(route, params) {
        return router.rootNode.buildPath(route, params);
    }

    function buildState(route, params) {
        return router.rootNode.buildState(route, params);
    }

    function matchPath(path, source) {
        var trailingSlash = options.trailingSlash;
        var strictQueryParams = options.strictQueryParams;

        var match = router.rootNode.matchPath(path, { trailingSlash: trailingSlash, strictQueryParams: strictQueryParams });
        return match ? router.makeState(match.name, match.params, path, match._meta, source) : null;
    }

    function setRootPath(rootPath) {
        router.rootNode.setPath(rootPath);
    }
}