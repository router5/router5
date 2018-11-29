import { createRouter } from 'router5'
import listenersPlugin from '../'

describe('listenersPlugin', () => {
    let router
    beforeAll(() => {
        router = createRouter([
            {
                name: 'home',
                path: '/home'
            },
            {
                name: 'users',
                path: '/users',
                children: [
                    {
                        name: 'view',
                        path: '/view/:id'
                    },
                    {
                        name: 'list',
                        path: '/list'
                    }
                ]
            },
            {
                name: 'orders',
                path: '/orders',
                children: [
                    { name: 'view', path: '/view/:id' },
                    { name: 'pending', path: '/pending' },
                    { name: 'completed', path: '/completed' }
                ]
            }
        ])
        router.usePlugin(listenersPlugin())
    })

    afterAll(() => {
        router.stop()
    })

    it('should be registered', () => {
        expect(router.hasPlugin('listenersPlugin')).toBe(true)
    })

    it('should call root node listener on first transition', function(done) {
        router.stop()
        router.setOption('defaultRoute', 'home')
        const nodeListener = jest.fn()
        router.addNodeListener('', nodeListener)

        router.start(function(err, state) {
            expect(state).toEqual({
                meta: {
                    id: 1,
                    options: { replace: true },
                    params: { home: {} }
                },
                name: 'home',
                path: '/home',
                params: {}
            })
            expect(nodeListener).toHaveBeenCalled()
            done()
        })
    })

    it('should invoke listeners on navigation', function(done) {
        router.navigate('home', {}, {}, () => {
            const previousState = router.getState()
            const listener = jest.fn()
            router.addListener(listener)

            router.navigate('orders.pending', {}, {}, () => {
                expect(listener).toHaveBeenLastCalledWith(
                    router.getState(),
                    previousState
                )
                router.removeListener(listener)
                done()
            })
        })
    })

    it('should not invoke listeners if trying to navigate to the current route', function(done) {
        router.navigate('orders.view', { id: 123 }, {}, () => {
            const listener = jest.fn()
            router.addListener(listener)

            router.navigate('orders.view', { id: 123 }, {}, () => {
                expect(listener).not.toHaveBeenCalled()
                done()
            })
        })
    })

    it('should invoke node listeners', function(done) {
        router.navigate('users.list', {}, {}, () => {
            const nodeListener = jest.fn()
            router.addNodeListener('users', nodeListener)
            router.navigate('users.view', { id: 1 }, {}, () => {
                expect(nodeListener).toHaveBeenCalled()
                router.navigate('users.view', { id: 1 }, {}, () => {
                    router.navigate('users.view', { id: 2 }, {}, function(
                        err,
                        state
                    ) {
                        expect(nodeListener).toHaveBeenCalledTimes(2)
                        router.removeNodeListener('users', nodeListener)
                        done()
                    })
                })
            })
        })
    })

    it('should invoke node listeners on root', function(done) {
        router.navigate('orders', {}, {}, () => {
            const nodeListener = jest.fn()
            router.addNodeListener('', nodeListener)
            router.navigate('users', {}, {}, () => {
                expect(nodeListener).toHaveBeenCalled()
                router.removeNodeListener('', nodeListener)
                done()
            })
        })
    })

    it('should invoke route listeners', function(done) {
        router.navigate('users.list', {}, {}, () => {
            const nodeListener = jest.fn()
            router.addRouteListener('users', nodeListener)
            router.navigate('users', {}, {}, () => {
                expect(nodeListener).toHaveBeenCalled()
                router.removeRouteListener('users', nodeListener)
                done()
            })
        })
    })

    it('should automatically remove node listeners if autoCleanUp', function(done) {
        router.navigate('orders.completed', {}, {}, function(err, state) {
            router.addNodeListener('orders', () => {})
            router.navigate('users', {}, {}, function(err, state) {
                setTimeout(() => {
                    expect(router.getListeners()['^orders']).toEqual([])
                    done()
                })
            })
        })
    })

    it('should warn if trying to register a listener on an unknown route', () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        router.addRouteListener('fake.route', () => {})
        expect(console.warn).toHaveBeenCalled()
        jest.resetAllMocks()
    })

    it('should not invoke listeners removed by previously called listeners', function(done) {
        router.navigate('home', {}, {}, () => {
            const listener2 = jest.fn()
            const listener1 = jest.fn(() => router.removeListener(listener2))
            router.addListener(listener1)
            router.addListener(listener2)

            router.navigate('orders.pending', {}, {}, () => {
                expect(listener2).not.toHaveBeenCalled()
                router.removeListener(listener1)
                done()
            })
        })
    })
})
