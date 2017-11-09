import { expect } from 'chai'
import createTestRouter from '../_create-router'

describe('core/clone', () => {
    it('should clone the root node', () => {
        const router = createTestRouter()
        const otherRouter = createTestRouter()

        expect(router.rootNode).to.not.equal(otherRouter.rootNode)

        const clonedRouter = router.clone()

        expect(clonedRouter.rootNode).to.equal(router.rootNode)
    })

    it('should clone plugins', () => {
        const router = createTestRouter()
        const myPlugin = () => ({
            onTransitionSuccess: () => true
        })

        router.usePlugin(myPlugin)

        const clonedRouter = router.clone()

        expect(clonedRouter.getPlugins()).to.contain(myPlugin)
    })

    it('should clone middleware functions', () => {
        const router = createTestRouter()
        const myMiddleware = () => () => true

        router.useMiddleware(myMiddleware)

        const clonedRouter = router.clone()

        expect(clonedRouter.getMiddlewareFactories()).to.contain(myMiddleware)
    })

    it('should clone canActivate handlers', () => {
        const router = createTestRouter()
        const canActivateAdmin = () => () => false

        router.canActivate('admin', canActivateAdmin)

        const clonedRouter = router.clone()

        expect(clonedRouter.getLifecycleFactories()[1].admin).to.equal(
            canActivateAdmin
        )
    })
})
