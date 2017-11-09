import { expect } from 'chai'
import createTestRouter from '../_create-router'
import { spy } from 'sinon'

describe('core/plugins', () => {
    let router
    let myPlugin, myPluginMethods

    before(() => {
        router = createTestRouter()
            .clone()
            .start()
        myPluginMethods = {
            onTransitionStart: spy(),
            onTransitionSuccess: spy(),
            onTransitionError: function onTransitionError() {}
        }
        myPlugin = router => {
            router.myCustomMethod = function() {}

            return myPluginMethods
        }
        myPlugin.pluginName = 'PLUGIN_NAME'
    })
    after(() => router.stop())

    it('should register plugins', function(done) {
        router.stop()
        router.usePlugin(myPlugin)
        expect(router.hasPlugin('PLUGIN_NAME'))
        router.start('', () => {
            expect(router.myCustomMethod).not.to.equal(undefined)

            router.navigate('orders', function(err, state) {
                expect(myPluginMethods.onTransitionStart).to.have.been.called
                expect(myPluginMethods.onTransitionSuccess).to.have.been.called
                done()
            })
        })
    })
})
