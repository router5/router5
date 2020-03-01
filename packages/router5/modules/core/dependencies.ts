import { Router } from '../types/router'

export default function withDependencies<Dependencies>(
    dependencies: Dependencies
) {
    return (router: Router<Dependencies>): Router<Dependencies> => {
        const routerDependencies: Dependencies = dependencies

        router.setDependency = (dependencyName, dependency) => {
            routerDependencies[dependencyName] = dependency
            return router
        }

        router.setDependencies = deps => {
            Object.keys(deps).forEach(name =>
                router.setDependency(name, deps[name])
            )
            return router
        }

        router.getDependencies = () => routerDependencies

        router.getInjectables = () => [router, router.getDependencies()]

        router.executeFactory = factoryFunction =>
            factoryFunction(...router.getInjectables())

        return router
    }
}
