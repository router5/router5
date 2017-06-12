export default function withUtils(router, options) {
    router.urlToPath = urlToPath;
    router.buildUrl = buildUrl;
    router.matchUrl = matchUrl;

    function buildUrl(route, params) {
        const base = options.base || '';
        const prefix = options.useHash ? `#${options.hashPrefix}` : '';
        const path = router.buildPath(route, params);

        return base + prefix + path;
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
        return router.matchPath(urlToPath(url));
    }
}
