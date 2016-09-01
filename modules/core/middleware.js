export default function withMiddleware(router) {
    let middlewareFactories = [];
    let middlewareFunctions = [];

    router.useMiddleware = useMiddleware;
    router.getMiddlewareFunctions = getMiddlewareFunctions;
    router.clearMiddleware = clearMiddleware;

    function useMiddleware(...middlewares) {
        middlewares.forEach(addMiddleware);

        return router;
    }

    function clearMiddleware() {
        middlewareFactories = [];
        middlewareFunctions = [];
    }

    function getMiddlewareFunctions () {
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
