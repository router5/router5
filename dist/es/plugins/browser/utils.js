export default function withUtils(router, options) {
    router.urlToPath = urlToPath;
    router.buildUrl = buildUrl;
    router.matchUrl = matchUrl;

    function buildUrl(route, params) {
        var base = options.base || '';
        var prefix = options.useHash ? '#' + options.hashPrefix : '';
        var path = router.buildPath(route, params);

        return base + prefix + path;
    }

    function urlToPath(url) {
        var match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
        var path = match ? match[1] : url;

        var pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);

        if (!pathParts) throw new Error('[router5] Could not parse url ' + url);

        var pathname = pathParts[1];
        var hash = pathParts[2] || '';
        var search = pathParts[3] || '';

        return (options.useHash ? hash.replace(new RegExp('^#' + options.hashPrefix), '') : options.base ? pathname.replace(new RegExp('^' + options.base), '') : pathname) + search;
    }

    function matchUrl(url) {
        return router.matchPath(urlToPath(url));
    }
}