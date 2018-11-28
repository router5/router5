const toFunction = val => (typeof val === 'function' ? val : () => () => val)

export default function withRouteLifecycle(router) {
    let canDeactivateFactories = {}
    let canActivateFactories = {}
    let canDeactivateFunctions = {}
    let canActivateFunctions = {}

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
}
