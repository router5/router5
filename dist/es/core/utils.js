export default function withUtils(router) {
    var options = router.getOptions();

    router.isActive = isActive;
    router.areStatesEqual = areStatesEqual;
    router.areStatesDescendants = areStatesDescendants;
    router.buildPath = buildPath;
    router.buildState = buildState;
    router.matchPath = matchPath;
    router.setRootPath = setRootPath;

    /**
     * Check if a route is currently active
     * @param  {String}  name                     The route name
     * @param  {Object}  params                   The route params
     * @param  {Boolean} [strictEquality=false]   Whether to check if the given route is the active route, or part of the active route
     * @param  {Boolean} [ignoreQueryParams=true] Whether to ignore query parameters
     * @return {Boolean}                          Whether the given route is active
     */
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

    /**
     * Compare two route state objects
     * @param  {Object}  state1            The route state
     * @param  {Object}  state2            The other route state
     * @param  {Boolean} ignoreQueryParams Whether to ignore query parameters or not
     * @return {Boolean}                   Whether the two route state are equal or not
     */
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

    /**
     * Check if two states are related
     * @param  {State} parentState  The parent state
     * @param  {State} childState   The child state
     * @return {Boolean}            Whether the two states are descendants or not
     */
    function areStatesDescendants(parentState, childState) {
        var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
        if (!regex.test(childState.name)) return false;
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(function (p) {
            return parentState.params[p] === childState.params[p];
        });
    }

    /**
     * Build a path
     * @param  {String} route  The route name
     * @param  {Object} params The route params
     * @return {String}        The path
     */
    function buildPath(route, params) {
        var useTrailingSlash = options.useTrailingSlash;

        return router.rootNode.buildPath(route, params, { trailingSlash: useTrailingSlash });
    }

    function buildState(route, params) {
        return router.rootNode.buildState(route, params);
    }

    /**
     * Match a path
     * @param  {String} path     The path to match
     * @param  {String} [source] The source (optional, used internally)
     * @return {Object}          The matched state (null if unmatched)
     */
    function matchPath(path, source) {
        var trailingSlash = options.trailingSlash;
        var strictQueryParams = options.strictQueryParams;
        var strongMatching = options.strongMatching;

        var match = router.rootNode.matchPath(path, { trailingSlash: trailingSlash, strictQueryParams: strictQueryParams, strongMatching: strongMatching });

        if (match) {
            var name = match.name;
            var params = match.params;
            var _meta = match._meta;

            var builtPath = options.useTrailingSlash === undefined ? path : router.buildPath(name, params);

            return router.makeState(name, params, builtPath, _meta, source);
        }

        return null;
    }

    /**
     * Set the root node patch, use carefully. It can be used to set app-wide allowed query parameters.
     * @param {String} rootPath The root node path
     */
    function setRootPath(rootPath) {
        router.rootNode.setPath(rootPath);
    }
}