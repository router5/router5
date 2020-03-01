import { errorCodes } from '../'
import { createTestRouter, omitMeta } from './helpers'

describe('core/route-lifecycle', function() {
    let router

    beforeAll(() => (router = createTestRouter().start()))
    afterAll(() => router.stop())

    it('should block navigation if a component refuses deactivation', done => {
        router.navigate('users.list', function() {
            // Cannot deactivate
            router.canDeactivate('users.list', () => () => Promise.reject())
            router.navigate('users', function(err) {
                expect(err.code).toBe(errorCodes.CANNOT_DEACTIVATE)
                expect(err.segment).toBe('users.list')
                expect(omitMeta(router.getState())).toEqual({
                    name: 'users.list',
                    params: {},
                    path: '/users/list'
                })

                // Can deactivate
                router.canDeactivate('users.list', true)
                router.navigate('users', function() {
                    expect(omitMeta(router.getState())).toEqual({
                        name: 'users',
                        params: {},
                        path: '/users'
                    })
                    // Auto clean up
                    expect(
                        router.getLifecycleFunctions()[0]['users.list']
                    ).toBe(undefined)
                    done()
                })
            })
        })
    })

    it('should register can deactivate status', done => {
        router.navigate('users.list', function() {
            router.canDeactivate('users.list', false)
            router.navigate('users', function(err) {
                expect(err.code).toBe(errorCodes.CANNOT_DEACTIVATE)
                expect(err.segment).toBe('users.list')
                router.canDeactivate('users.list', true)
                router.navigate('users', function(err) {
                    expect(err).toBe(null)
                    done()
                })
            })
        })
    })

    it('should block navigation if a route cannot be activated', done => {
        router.navigate('home', function() {
            router.navigate('admin', function(err) {
                expect(err.code).toBe(errorCodes.CANNOT_ACTIVATE)
                expect(err.segment).toBe('admin')
                expect(router.isActive('home')).toBe(true)
                done()
            })
        })
    })

    it('should force deactivation if specified as a transition option', done => {
        router.navigate('orders.view', { id: '1' }, {}, () => {
            router.canDeactivate('orders.view', false)
            router.navigate('home', err => {
                expect(err.code).toBe(errorCodes.CANNOT_DEACTIVATE)
                router.navigate(
                    'home',
                    {},
                    { forceDeactivate: true },
                    (err, state) => {
                        expect(state.name).toBe('home')
                        done()
                    }
                )
            })
        })
    })
})
