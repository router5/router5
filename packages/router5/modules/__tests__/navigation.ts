import { constants, errorCodes, createRouter } from '../'
import { createTestRouter, omitMeta } from './helpers'

const noop = () => {}

describe('core/navigation', function() {
    let router

    beforeAll(() => {
        router = createTestRouter().start()
    })
    afterAll(() => router.stop())

    afterEach(() => jest.clearAllMocks())

    it('should be able to navigate to routes', done => {
        router.navigate('users.view', { id: 123 }, {}, function(err, state) {
            expect(omitMeta(state)).toEqual({
                name: 'users.view',
                params: { id: 123 },
                path: '/users/view/123'
            })
            done()
        })
    })

    it('should navigate to same state if reload is set to true', done => {
        router.navigate('orders.pending', function() {
            router.navigate('orders.pending', function(err) {
                expect(err.code).toBe(errorCodes.SAME_STATES)

                router.navigate(
                    'orders.pending',
                    {},
                    { reload: true },
                    function(err) {
                        expect(err).toBe(null)
                        done()
                    }
                )
            })
        })
    })

    it('should be able to cancel a transition', done => {
        router.canActivate('admin', () => () => Promise.resolve())
        const cancel = router.navigate('admin', function(err) {
            expect(err.code).toBe(errorCodes.TRANSITION_CANCELLED)
            done()
        })
        cancel()
    })

    it('should be able to handle multiple cancellations', done => {
        router.useMiddleware(() => (toState, fromState, done) => {
            setTimeout(done, 20)
        })
        router.navigate('users', err => {
            expect(err.code).toBe(errorCodes.TRANSITION_CANCELLED)
        })
        router.navigate('users', err => {
            expect(err.code).toBe(errorCodes.TRANSITION_CANCELLED)
        })
        router.navigate('users', err => {
            expect(err.code).toBe(errorCodes.TRANSITION_CANCELLED)
        })
        router.navigate('users', () => {
            router.clearMiddleware()
            done()
        })
    })

    it('should redirect if specified by transition error, and call back', done => {
        router.stop()
        router.start('/auth-protected', (err, state) => {
            expect(omitMeta(state)).toEqual({
                name: 'sign-in',
                params: {},
                path: '/sign-in'
            })
            router.navigate('auth-protected', (err, state) => {
                expect(omitMeta(state)).toEqual({
                    name: 'sign-in',
                    params: {},
                    path: '/sign-in'
                })
                done()
            })
        })
    })

    it('should pass along handled errors in promises', done => {
        router.clearMiddleware()
        router.stop()
        router.canActivate('admin', () => () =>
            Promise.resolve(new Error('error message'))
        )
        router.start('', () => {
            router.navigate('admin', function(err) {
                expect(err.code).toBe(errorCodes.CANNOT_ACTIVATE)
                expect(err.error.message).toBe('error message')
                done()
            })
        })
    })

    it('should pass along handled errors in promises', done => {
        jest.spyOn(console, 'error').mockImplementation(noop)
        router.stop()
        router.canActivate('admin', () => () =>
            new Promise(() => {
                throw new Error('unhandled error')
            })
        )
        router.start('', () => {
            router.navigate('admin', function(err) {
                expect(err.code).toBe(errorCodes.CANNOT_ACTIVATE)
                expect(console.error).toHaveBeenCalled()
                done()
            })
        })
    })

    it('should prioritise cancellation errors', done => {
        router.stop()
        router.canActivate('admin', () => () =>
            new Promise((resolve, reject) => {
                setTimeout(() => reject(), 20)
            })
        )
        router.start('', () => {
            const cancel = router.navigate('admin', function(err) {
                expect(err.code).toBe(errorCodes.TRANSITION_CANCELLED)
                done()
            })
            setTimeout(cancel, 10)
        })
    })

    it('should let users navigate to unkown URLs if allowNotFound is set to true', done => {
        router.setOption('allowNotFound', true)
        router.setOption('defaultRoute', undefined)
        router.stop()
        router.start('/unkown-url', (err, state) => {
            expect(state.name).toBe(constants.UNKNOWN_ROUTE)
            done()
        })
    })

    it('should forward a route to another route', done => {
        router.forward('profile', 'profile.me')

        router.navigate('profile', (err, state) => {
            expect(state.name).toBe('profile.me')
            router.forward('profile', undefined)
            done()
        })
    })

    it('should forward a route to another with default params', done => {
        const routerTest = createRouter([
            {
                name: 'app',
                path: '/app',
                forwardTo: 'app.version',
                defaultParams: {
                    lang: 'en'
                }
            },
            {
                name: 'app.version',
                path: '/:version',
                defaultParams: { version: 'v1' }
            }
        ])

        routerTest.start('/app', (err, state) => {
            expect(state.name).toBe('app.version')
            expect(state.params).toEqual({
                version: 'v1',
                lang: 'en'
            })
            done()
        })
    })

    it('should encode params to path', done => {
        router.navigate(
            'withEncoder',
            { one: 'un', two: 'deux' },
            (err, state) => {
                expect(state.path).toEqual('/encoded/un/deux')
                done()
            }
        )
    })

    it('should extend default params', () => {
        router.navigate('withDefaultParam', (err, state) => {
            expect(state.params).toEqual({
                param: 'hello'
            })
        })
    })

    it('should add navitation options to meta', () => {
        const options = { reload: true, replace: true, customOption: 'abc' }
        router.navigate('profile', {}, options, (err, state) => {
            expect(state.meta.options).toEqual(options)
        })
    })
})
