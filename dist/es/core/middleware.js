export default function withMiddleware(router) {
    var middlewareFactories = [];
    var middlewareFunctions = [];

    router.useMiddleware = useMiddleware;
    router.getMiddlewareFunctions = getMiddlewareFunctions;
    router.clearMiddleware = clearMiddleware;

    function useMiddleware() {
        for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
            middlewares[_key] = arguments[_key];
        }

        middlewares.forEach(addMiddleware);

        return router;
    }

    function clearMiddleware() {
        middlewareFactories = [];
        middlewareFunctions = [];
    }

    function getMiddlewareFunctions() {
        return middlewareFunctions;
    }

    function addMiddleware(middleware) {
        middlewareFactories.push(middleware);
        startMiddleware(middleware);
    }

    function startMiddleware(middleware) {
        middlewareFunctions.push(router.executeFactory(middleware));
    }
}