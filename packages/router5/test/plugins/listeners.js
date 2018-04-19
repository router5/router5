import createRouter from '../_create-router'
import chai, { expect } from 'chai'
import { spy, stub } from 'sinon'
import sinonChai from 'sinon-chai'
import listenersPlugin from '../../modules/plugins/listeners'

chai.use(sinonChai)

let router

describe('listenersPlugin', function() {
    before(function() {
        router = createRouter()
        router.usePlugin(listenersPlugin())
    })

    after(function() {
        router.stop()
    })

    it('should be registered', function() {
        expect(router.hasPlugin('listenersPlugin')).toBeTrue
    })

    it('should call root node listener on first transition', function(done) {
        router.stop()
        router.setOption('defaultRoute', 'home')
        const nodeListener = spy()
        router.addNodeListener('', nodeListener)

        router.start(function(err, state) {
            expect(state).to.eql({
                meta: {
                    id: 1,
                    options: { replace: true },
                    params: { home: {} }
                },
                name: 'home',
                path: '/home',
                params: {}
            })
            expect(nodeListener).to.have.been.called
            done()
        })
    })

    it('should invoke listeners on navigation', function(done) {
        router.navigate('home', {}, {}, function() {
            const previousState = router.getState()
            const listener = spy()
            router.addListener(listener)

            router.navigate('orders.pending', {}, {}, function() {
                expect(listener).to.have.been.calledWith(
                    router.getState(),
                    previousState
                )
                router.removeListener(listener)
                done()
            })
        })
    })

    it('should not invoke listeners if trying to navigate to the current route', function(done) {
        router.navigate('orders.view', { id: 123 }, {}, function() {
            const listener = spy()
            router.addListener(listener)

            router.navigate('orders.view', { id: 123 }, {}, function() {
                expect(listener).not.to.have.been.called
                done()
            })
        })
    })

    it('should invoke node listeners', function(done) {
        router.navigate('users.list', {}, {}, function() {
            const nodeListener = spy()
            router.addNodeListener('users', nodeListener)
            router.navigate('users.view', { id: 1 }, {}, function() {
                expect(nodeListener).to.have.been.called
                router.navigate('users.view', { id: 1 }, {}, function() {
                    router.navigate('users.view', { id: 2 }, {}, function(
                        err,
                        state
                    ) {
                        expect(nodeListener).to.have.been.calledTwice
                        router.removeNodeListener('users', nodeListener)
                        done()
                    })
                })
            })
        })
    })

    it('should invoke node listeners on root', function(done) {
        router.navigate('orders', {}, {}, function() {
            const nodeListener = spy()
            router.addNodeListener('', nodeListener)
            router.navigate('users', {}, {}, function() {
                expect(nodeListener).to.have.been.called
                router.removeNodeListener('', nodeListener)
                done()
            })
        })
    })

    it('should invoke route listeners', function(done) {
        router.navigate('users.list', {}, {}, function() {
            const nodeListener = spy()
            router.addRouteListener('users', nodeListener)
            router.navigate('users', {}, {}, function() {
                expect(nodeListener).to.have.been.called
                router.removeRouteListener('users', nodeListener)
                done()
            })
        })
    })

    it('should automatically remove node listeners if autoCleanUp', function(done) {
        router.navigate('orders.completed', {}, {}, function(err, state) {
            router.addNodeListener('orders', () => {})
            router.navigate('users', {}, {}, function(err, state) {
                setTimeout(function() {
                    expect(router.getListeners()['^orders']).to.eql([])
                    done()
                })
            })
        })
    })

    it('should warn if trying to register a listener on an unknown route', function() {
        stub(console, 'warn')
        router.addRouteListener('fake.route', function() {})
        expect(console.warn).to.have.been.called
        console.warn.restore()
    })

    it('should not invoke listeners removed by previously called listeners', function(done) {
        router.navigate('home', {}, {}, function() {
            const previousState = router.lastKnownState
            const listener2 = spy()
            const listener1 = spy(() => router.removeListener(listener2))
            router.addListener(listener1)
            router.addListener(listener2)

            router.navigate('orders.pending', {}, {}, function() {
                expect(listener2).not.to.have.been.called
                router.removeListener(listener1)
                done()
            })
        })
    })
})
