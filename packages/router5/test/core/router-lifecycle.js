import { expect } from 'chai'
import { errorCodes } from '../../modules'
import createTestRouter from '../_create-router'
import { omitMeta } from '../_helpers'

const homeState = {
    name: 'home',
    params: {},
    path: '/home',
    meta: { id: 1, params: { home: {} } }
}

describe('core/router-lifecycle', function() {
    let router

    before(() => (router = createTestRouter().clone()))
    after(() => router.stop())

    it('should start with the default route', function(done) {
        expect(router.getState()).to.equal(null)
        expect(router.isActive('home')).to.equal(false)

        router.start('/not-existing', function() {
            expect(router.isStarted()).to.equal(true)
            expect(omitMeta(router.getState())).to.eql({
                name: 'home',
                params: {},
                path: '/home'
            })
            done()
        })
    })

    it('should throw an error when starting with no start path or state', function(done) {
        router.stop()
        router.setOption('defaultRoute', null)
        router.start(err => {
            expect(err.code).to.equal(errorCodes.NO_START_PATH_OR_STATE)
            router.setOption('defaultRoute', 'home')
            done()
        })
    })

    it('should not throw an error when starting with no callback', function() {
        router.stop()
        expect(() => router.start('')).not.to.throw()
    })

    it('should give an error if trying to start when already started', function(done) {
        router.start('', function(err) {
            expect(err.code).to.equal(errorCodes.ROUTER_ALREADY_STARTED)
            done()
        })
    })

    it('should start with the start route if matched', function(done) {
        router.stop()
        router.start('/section123/query?param1=1__1&param1=2__2', function(
            err,
            state
        ) {
            expect(omitMeta(state)).to.eql({
                name: 'section.query',
                params: { section: 'section123', param1: ['1__1', '2__2'] },
                path: '/section123/query?param1=1__1&param1=2__2'
            })
            done()
        })
    })

    it('should start with the default route if start route is not matched', function(done) {
        router.stop()
        router.start('/about', function(err, state) {
            expect(omitMeta(router.getState())).to.eql({
                name: 'home',
                params: {},
                path: '/home'
            })
            done()
        })
    })

    it('should start with the default route if navigation to start route is not allowed', function(done) {
        router.stop()
        router.start('/admin', function() {
            expect(omitMeta(router.getState())).to.eql({
                name: 'home',
                params: {},
                path: '/home'
            })
            done()
        })
    })

    it('should start with the provided path', function(done) {
        router.stop()
        router.start('/users', function(err, state) {
            expect(omitMeta(state)).to.eql({
                name: 'users',
                params: {},
                path: '/users'
            })
            done()
        })
    })

    it('should start with an error if navigation to start route is not allowed and no default route is specified', function(done) {
        router.stop()
        router.setOption('defaultRoute', null)
        router.start('/admin', function(err) {
            expect(err.code).to.equal(errorCodes.CANNOT_ACTIVATE)
            expect(err.segment).to.equal('admin')
            done()
        })
    })

    it('should start with a not found error if no matched start state and no default route', function(done) {
        router.stop()
        router.setOption('defaultRoute', null)
        router.start('/not-existing', function(err) {
            expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND)
            done()
        })
    })

    it('should not match an URL with extra trailing slashes', function(done) {
        router.setOption('strictTrailingSlash', true)
        router.stop()
        router.start('/users/list/', function(err, state) {
            expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND)
            expect(state).to.equal(null)
            router.setOption('strictTrailingSlash', false)
            done()
        })
    })

    it('should match an URL with extra trailing slashes', function(done) {
        router.stop()
        router.start('/users/list/', function(err, state) {
            expect(omitMeta(state)).to.eql({
                name: 'users.list',
                params: {},
                path: '/users/list'
            })
            done()
        })
    })

    it('should start with the provided state', function(done) {
        router.stop()
        router.start(homeState, function(err, state) {
            expect(state).to.eql(homeState)
            expect(router.getState()).to.eql(homeState)
            done()
        })
    })

    it('should not reuse id when starting with provided state', function(done) {
        router.stop()
        expect(homeState.meta.id).to.eql(1)
        router.start(homeState, function(err, state) {
            router.navigate('users', function(err, state) {
                expect(state.meta.id).to.not.eql(1)
                done()
            })
        })
    })

    it('should return an error if default route access is not found', function(done) {
        router.stop()
        router.setOption('defaultRoute', 'fake.route')

        router.start('/not-existing', function(err, state) {
            expect(err.code).to.equal(errorCodes.ROUTE_NOT_FOUND)
            done()
        })
    })

    it('should be able to stop routing', function(done) {
        router.navigate('users', function() {
            router.stop()
            expect(router.isStarted()).to.equal(false)
            router.navigate('users.list', function(err) {
                expect(err.code).to.equal(errorCodes.ROUTER_NOT_STARTED)
                // Stopping again shouldn't throw an error
                router.stop()
                router.start('', () => done())
            })
        })
    })
})
