import constants from '../constants';

export default function withUtils(router) {
    const options = router.getOptions();

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
    function isActive(
        name,
        params = {},
        strictEquality = false,
        ignoreQueryParams = true
    ) {
        const activeState = router.getState();

        if (!activeState) return false;

        if (strictEquality || activeState.name === name) {
            return areStatesEqual(
                router.makeState(name, params),
                activeState,
                ignoreQueryParams
            );
        }

        return areStatesDescendants(
            router.makeState(name, params),
            activeState
        );
    }

    /**
     * Compare two route state objects
     * @param  {Object}  state1            The route state
     * @param  {Object}  state2            The other route state
     * @param  {Boolean} ignoreQueryParams Whether to ignore query parameters or not
     * @return {Boolean}                   Whether the two route state are equal or not
     */
    function areStatesEqual(state1, state2, ignoreQueryParams = true) {
        if (state1.name !== state2.name) return false;

        const getUrlParams = name =>
            router.rootNode
                .getSegmentsByName(name)
                .map(segment => segment.parser['urlParams'])
                .reduce((params, p) => params.concat(p), []);

        const state1Params = ignoreQueryParams
            ? getUrlParams(state1.name)
            : Object.keys(state1.params);
        const state2Params = ignoreQueryParams
            ? getUrlParams(state2.name)
            : Object.keys(state2.params);

        return (
            state1Params.length === state2Params.length &&
            state1Params.every(p => state1.params[p] === state2.params[p])
        );
    }

    /**
     * Check if two states are related
     * @param  {State} parentState  The parent state
     * @param  {State} childState   The child state
     * @return {Boolean}            Whether the two states are descendants or not
     */
    function areStatesDescendants(parentState, childState) {
        const regex = new RegExp('^' + parentState.name + '\\.(.*)$');
        if (!regex.test(childState.name)) return false;
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(
            p => parentState.params[p] === childState.params[p]
        );
    }

    /**
     * Build a path
     * @param  {String} route  The route name
     * @param  {Object} params The route params
     * @return {String}        The path
     */
    function buildPath(route, params) {
        if (route === constants.UNKNOWN_ROUTE) {
            return params.path;
        }

        const { useTrailingSlash, strictQueryParams } = options;
        return router.rootNode.buildPath(route, params, {
            trailingSlash: useTrailingSlash,
            strictQueryParams
        });
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
        const { trailingSlash, strictQueryParams, strongMatching } = options;
        const match = router.rootNode.matchPath(path, {
            trailingSlash,
            strictQueryParams,
            strongMatching
        });

        if (match) {
            const { name, params, _meta } = match;
            const builtPath = options.useTrailingSlash === undefined
                ? path
                : router.buildPath(name, params);
            const routeName = router.forwardMap[name] || name;

            return router.makeState(
                routeName,
                params,
                builtPath,
                _meta,
                source
            );
        }

        return null;
    }

    /**
     * Set the root node path, use carefully. It can be used to set app-wide allowed query parameters.
     * @param {String} rootPath The root node path
     */
    function setRootPath(rootPath) {
        router.rootNode.setPath(rootPath);
    }
}
