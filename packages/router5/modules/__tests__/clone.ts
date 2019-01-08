import createTestRouter from './helpers/testRouters'
import cloneRouter from '../clone'

describe('core/clone', () => {
    it('should clone the root node', () => {
        const router = createTestRouter()
        const otherRouter = createTestRouter()

        expect(router.rootNode).not.toBe(otherRouter.rootNode)

        const clonedRouter = cloneRouter(router)

        expect(clonedRouter.rootNode).toBe(router.rootNode)
    })

    it('should clone plugins', () => {
        const router = createTestRouter()
        const myPlugin = () => ({
            onTransitionSuccess: () => true
        })
        router.usePlugin(myPlugin)

        const clonedRouter = cloneRouter(router)

        expect(clonedRouter.getPlugins()).toContain(myPlugin)
    })

    it('should clone middleware functions', () => {
        const router = createTestRouter()
        const myMiddleware = () => () => true

        router.useMiddleware(myMiddleware)

        const clonedRouter = cloneRouter(router)

        expect(clonedRouter.getMiddlewareFactories()).toContain(myMiddleware)
    })

    it('should clone canActivate handlers', () => {
        const router = createTestRouter()
        const canActivateAdmin = () => () => false

        router.canActivate('admin', canActivateAdmin)

        const clonedRouter = cloneRouter(router)

        expect(clonedRouter.getLifecycleFactories()[1].admin).toBe(
            canActivateAdmin
        )
    })
})
