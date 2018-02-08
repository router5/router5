import { expect } from 'chai'
import { errorCodes } from '../../modules'
import createTestRouter from '../_create-router'
import { omitMeta } from '../_helpers'

describe('core/route-lifecycle', function() {
    let router

    before(
        () =>
            (router = createTestRouter()
                .clone()
                .start())
    )
    after(() => router.stop())

    it('should block navigation if a component refuses deactivation', function(done) {
        router.navigate('users.list', function() {
            // Cannot deactivate
            router.canDeactivate('users.list', () => () => Promise.reject())
            router.navigate('users', function(err) {
                expect(err.code).to.equal(errorCodes.CANNOT_DEACTIVATE)
                expect(err.segment).to.equal('users.list')
                expect(omitMeta(router.getState())).to.eql({
                    name: 'users.list',
                    params: {},
                    path: '/users/list'
                })

                // Can deactivate
                router.canDeactivate('users.list', true)
                router.navigate('users', function() {
                    expect(omitMeta(router.getState())).to.eql({
                        name: 'users',
                        params: {},
                        path: '/users'
                    })
                    // Auto clean up
                    expect(
                        router.getLifecycleFunctions()[0]['users.list']
                    ).to.equal(undefined)
                    done()
                })
            })
        })
    })

    it('should register can deactivate status', function(done) {
        router.navigate('users.list', function(err) {
            router.canDeactivate('users.list', false)
            router.navigate('users', function(err) {
                expect(err.code).to.equal(errorCodes.CANNOT_DEACTIVATE)
                expect(err.segment).to.equal('users.list')
                router.canDeactivate('users.list', true)
                router.navigate('users', function(err) {
                    expect(err).to.equal(null)
                    done()
                })
            })
        })
    })

    it('should block navigation if a route cannot be activated', function(done) {
        router.navigate('home', function() {
            router.navigate('admin', function(err) {
                expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE)
                expect(err.segment).to.equal('admin')
                expect(router.isActive('home')).to.equal(true)
                done()
            })
        })
    })

    it('should force deactivation if specified as a transition option', done => {
        router.navigate('orders.view', { id: '1' }, {}, (err, state) => {
            router.canDeactivate('orders.view', false)
            router.navigate('home', (err, state) => {
                expect(err.code).to.equal(errorCodes.CANNOT_DEACTIVATE)
                router.navigate(
                    'home',
                    {},
                    { forceDeactivate: true },
                    (err, state) => {
                        expect(state.name).to.equal('home')
                        done()
                    }
                )
            })
        })
    })
})
