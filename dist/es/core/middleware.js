export default function withMiddleware(router) {
    var middlewareFactories = [];
    var middlewareFunctions = [];

    router.useMiddleware = useMiddleware;
    router.getMiddlewareFactories = getMiddlewareFactories;
    router.getMiddlewareFunctions = getMiddlewareFunctions;
    router.clearMiddleware = clearMiddleware;

    /**
     * Register middleware functions.
     * @param  {...Function} middlewares The middleware functions
     * @return {Object}                  The router instance
     */
    function useMiddleware() {
        for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
            middlewares[_key] = arguments[_key];
        }

        middlewares.forEach(addMiddleware);

        return router;
    }

    /**
     * Remove all middleware functions
     * @return {Object} The router instance
     */
    function clearMiddleware() {
        middlewareFactories = [];
        middlewareFunctions = [];

        return router;
    }

    function getMiddlewareFactories() {
        return middlewareFactories;
    }

    function getMiddlewareFunctions() {
        return middlewareFunctions;
    }

    function addMiddleware(middleware) {
        middlewareFactories.push(middleware);
        middlewareFunctions.push(router.executeFactory(middleware));
    }
}