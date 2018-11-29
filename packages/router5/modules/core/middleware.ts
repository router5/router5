import { Router } from '../types/router'

export default function withMiddleware(router: Router): Router {
    let middlewareFactories = []
    let middlewareFunctions = []

    router.useMiddleware = (...middlewares) => {
        middlewares.forEach(middleware => {
            middlewareFactories.push(middleware)
            middlewareFunctions.push(router.executeFactory(middleware))
        })

        return router
    }

    router.clearMiddleware = () => {
        middlewareFactories = []
        middlewareFunctions = []

        return router
    }

    router.getMiddlewareFactories = () => middlewareFactories

    router.getMiddlewareFunctions = () => middlewareFunctions

    return router
}
