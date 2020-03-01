import { Router, DefaultDependencies } from './types/router'
import createRouter from './createRouter'

export default function cloneRouter<
    Dependencies extends DefaultDependencies = DefaultDependencies
>(router: Router, dependencies?: Dependencies): Router<Dependencies> {
    const clonedRouter = createRouter<Dependencies>(
        router.rootNode,
        router.getOptions(),
        dependencies
    )

    clonedRouter.useMiddleware(...router.getMiddlewareFactories())
    clonedRouter.usePlugin(...router.getPlugins())
    clonedRouter.config = router.config

    const [
        canDeactivateFactories,
        canActivateFactories
    ] = router.getLifecycleFactories()

    Object.keys(canDeactivateFactories).forEach(name =>
        clonedRouter.canDeactivate(name, canDeactivateFactories[name])
    )
    Object.keys(canActivateFactories).forEach(name =>
        clonedRouter.canActivate(name, canActivateFactories[name])
    )

    return clonedRouter
}
