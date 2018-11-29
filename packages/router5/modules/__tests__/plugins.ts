import { createTestRouter } from './helpers'

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
        myPlugin.pluginName = 'PLUGIN_NAME'
    })
    afterAll(() => router.stop())

    it('should register plugins', done => {
        router.stop()
        router.usePlugin(myPlugin)
        expect(router.hasPlugin('PLUGIN_NAME'))
        router.start('', () => {
            expect(router.myCustomMethod).not.toBe(undefined)

            router.navigate('orders', function(err, state) {
                expect(myPluginMethods.onTransitionStart).toHaveBeenCalled()
                expect(myPluginMethods.onTransitionSuccess).toHaveBeenCalled()
                done()
            })
        })
    })
})
