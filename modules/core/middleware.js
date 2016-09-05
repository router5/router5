export default function withMiddleware(router) {
    let middlewareFunctions = [];

    router.useMiddleware = useMiddleware;
    router.getMiddlewareFunctions = getMiddlewareFunctions;
    router.clearMiddleware = clearMiddleware;

    function useMiddleware(...middlewares) {
        middlewares.forEach(addMiddleware);

        return router;
    }

    function clearMiddleware() {
        middlewareFunctions = [];
    }

    function getMiddlewareFunctions () {
        return middlewareFunctions;
    }

    function addMiddleware(middleware) {
        middlewareFunctions.push(router.executeFactory(middleware));
    }
}
