import { createTestRouter } from './helpers'
import createRouter from '..'

describe('core/plugins', () => {
    let router
    let myPlugin, myPluginMethods

    beforeAll(() => {
        router = createTestRouter().start()
        myPluginMethods = {
            onTransitionStart: jest.fn(),
            onTransitionSuccess: jest.fn(),
            onTransitionError: function onTransitionError() {}
        }
        myPlugin = router => {
            router.myCustomMethod = function() {}

            return myPluginMethods
        }
    })
    afterAll(() => router.stop())

    it('should register plugins', done => {
        router.stop()
        router.usePlugin(myPlugin)
        router.start('', () => {
            expect(router.myCustomMethod).not.toBe(undefined)

            router.navigate('orders', function(err, state) {
                expect(myPluginMethods.onTransitionStart).toHaveBeenCalled()
                expect(myPluginMethods.onTransitionSuccess).toHaveBeenCalled()
                done()
            })
        })
    })

    it('should return an deregister function and call teardown', () => {
        const router = createRouter()
        const teardown = jest.fn()
        const unsubscribe = router.usePlugin(() => ({
            teardown
        }))

        expect(router.getPlugins().length).toBe(1)

        unsubscribe()

        expect(router.getPlugins().length).toBe(0)
        expect(teardown).toHaveBeenCalled()
    })
})
