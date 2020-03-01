import { Router } from '../types/router'

export default function withMiddleware<Dependencies>(
    router: Router<Dependencies>
): Router<Dependencies> {
    let middlewareFactories = []
    let middlewareFunctions = []

    router.useMiddleware = (...middlewares) => {
        const removePluginFns: Array<() => void> = middlewares.map(
            middleware => {
                const middlewareFunction = router.executeFactory(middleware)

                middlewareFactories.push(middleware)
                middlewareFunctions.push(middlewareFunction)

                return () => {
                    middlewareFactories = middlewareFactories.filter(
                        m => m !== middleware
                    )
                    middlewareFunctions = middlewareFunctions.filter(
                        m => m !== middlewareFunction
                    )
                }
            }
        )

        return () => removePluginFns.forEach(fn => fn())
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
