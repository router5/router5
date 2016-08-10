export default function withUtils(router) {
    const options = router.getOptions();

    router.isActive = isActive;
    router.areStatesEqual = areStatesEqual;
    router.areStatesDescendants = areStatesDescendants;
    router.buildUrl = buildUrl;
    router.buildPath = buildPath;
    router.buildState = buildState;
    router.matchPath = matchPath;
    router.urlToPath = urlToPath;
    router.matchUrl = matchUrl;
    router.setRootPath = setRootPath;

    function isActive(name, params = {}, strictEquality = false, ignoreQueryParams = true) {
        const activeState = router.getState();

        if (!activeState) return false;

        if (strictEquality || activeState.name === name) {
            return areStatesEqual(router.makeState(name, params), activeState, ignoreQueryParams);
        }

        return areStatesDescendants(router.makeState(name, params), activeState);
    }

    function areStatesEqual(state1, state2, ignoreQueryParams = true) {
        if (state1.name !== state2.name) return false;

        const getUrlParams = name => router.rootNode
            .getSegmentsByName(name)
            .map(segment => segment.parser[ignoreQueryParams ? 'urlParams' : 'params'])
            .reduce((params, p) => params.concat(p), []);

        const state1Params = getUrlParams(state1.name);
        const state2Params = getUrlParams(state2.name);

        return state1Params.length === state2Params.length &&
            state1Params.every(p => state1.params[p] === state2.params[p]);
    }

    function areStatesDescendants(parentState, childState) {
        const regex = new RegExp('^' + parentState.name + '\\.(.*)$');
        if (!regex.test(childState.name)) return false;
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(p => parentState.params[p] === childState.params[p]);
    }

    function buildUrl(route, params) {
        return _buildUrl(buildPath(route, params));
    }

    function _buildUrl(path) {
        return (options.base || '') +
            (options.useHash ? '#' + options.hashPrefix : '') +
            path;
    }

    function buildPath(route, params) {
        return router.rootNode.buildPath(route, params);
    }

    function buildState(route, params) {
        return router.rootNode.buildState(route, params);
    }

    function matchPath(path, source) {
        const { trailingSlash, strictQueryParams } = options;
        const match = router.rootNode.matchPath(path, { trailingSlash, strictQueryParams });
        return match ? router.makeState(match.name, match.params, path, match._meta, source) : null;
    }

    function urlToPath(url) {
        const match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
        const path = match ? match[1] : url;

        const pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);

        if (!pathParts) throw new Error(`[router5] Could not parse url ${url}`);

        const pathname = pathParts[1];
        const hash     = pathParts[2] || '';
        const search   = pathParts[3] || '';

        return (
            options.useHash
            ? hash.replace(new RegExp('^#' + options.hashPrefix), '')
            : (options.base ? pathname.replace(new RegExp('^' + options.base), '') : pathname)
        ) + search;
    }

    function matchUrl(url) {
        return matchPath(urlToPath(url));
    }

    function setRootPath(rootPath) {
        router.rootNode.setPath(rootPath);
    }
}
