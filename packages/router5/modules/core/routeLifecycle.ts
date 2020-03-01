import { Router } from '../types/router'

const toFunction = val => (typeof val === 'function' ? val : () => () => val)

export default function withRouteLifecycle<Dependencies>(
    router: Router<Dependencies>
): Router<Dependencies> {
    const canDeactivateFactories = {}
    const canActivateFactories = {}
    const canDeactivateFunctions = {}
    const canActivateFunctions = {}

    router.getLifecycleFactories = () => {
        return [canDeactivateFactories, canActivateFactories]
    }

    router.getLifecycleFunctions = () => {
        return [canDeactivateFunctions, canActivateFunctions]
    }

    router.canDeactivate = (name, canDeactivateHandler) => {
        const factory = toFunction(canDeactivateHandler)

        canDeactivateFactories[name] = factory
        canDeactivateFunctions[name] = router.executeFactory(factory)

        return router
    }

    router.clearCanDeactivate = name => {
        canDeactivateFactories[name] = undefined
        canDeactivateFunctions[name] = undefined

        return router
    }

    router.canActivate = (name, canActivateHandler) => {
        const factory = toFunction(canActivateHandler)

        canActivateFactories[name] = factory
        canActivateFunctions[name] = router.executeFactory(factory)

        return router
    }

    return router
}
