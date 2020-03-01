import { errorCodes } from '../'
import { createTestRouter, omitMeta } from './helpers'

const homeState = {
    name: 'home',
    params: {},
    path: '/home',
    meta: { id: 1, params: { home: {} } }
}

describe('core/router-lifecycle', function() {
    let router

    beforeAll(() => (router = createTestRouter()))
    afterAll(() => router.stop())

    it('should start with the default route', done => {
        expect(router.getState()).toBe(null)
        expect(router.isActive('home')).toBe(false)

        router.start('/not-existing', function() {
            expect(router.isStarted()).toBe(true)
            expect(omitMeta(router.getState())).toEqual({
                name: 'home',
                params: {},
                path: '/home'
            })
            done()
        })
    })

    it('should throw an error when starting with no start path or state', done => {
        router.stop()
        router.setOption('defaultRoute', null)
        router.start(err => {
            expect(err.code).toBe(errorCodes.NO_START_PATH_OR_STATE)
            router.setOption('defaultRoute', 'home')
            done()
        })
    })

    it('should not throw an error when starting with no callback', function() {
        router.stop()
        expect(() => router.start('')).not.toThrow()
    })

    it('should give an error if trying to start when already started', done => {
        router.start('', function(err) {
            expect(err.code).toBe(errorCodes.ROUTER_ALREADY_STARTED)
            done()
        })
    })

    it('should start with the start route if matched', done => {
        router.stop()
        router.start('/section123/query?param1=1__1&param1=2__2', function(
            err,
            state
        ) {
            expect(omitMeta(state)).toEqual({
                name: 'section.query',
                params: { section: 'section123', param1: ['1__1', '2__2'] },
                path: '/section123/query?param1=1__1&param1=2__2'
            })
            done()
        })
    })

    it('should start with the default route if start route is not matched', done => {
        router.stop()
        router.start('/about', function() {
            expect(omitMeta(router.getState())).toEqual({
                name: 'home',
                params: {},
                path: '/home'
            })
            done()
        })
    })

    it('should start with the default route if navigation to start route is not allowed', done => {
        router.stop()
        router.start('/admin', function() {
            expect(omitMeta(router.getState())).toEqual({
                name: 'home',
                params: {},
                path: '/home'
            })
            done()
        })
    })

    it('should start with the provided path', done => {
        router.stop()
        router.start('/users', function(err, state) {
            expect(omitMeta(state)).toEqual({
                name: 'users',
                params: {},
                path: '/users'
            })
            done()
        })
    })

    it('should start with an error if navigation to start route is not allowed and no default route is specified', done => {
        router.stop()
        router.setOption('defaultRoute', null)
        router.start('/admin', function(err) {
            expect(err.code).toBe(errorCodes.CANNOT_ACTIVATE)
            expect(err.segment).toBe('admin')
            done()
        })
    })

    it('should start with a not found error if no matched start state and no default route', done => {
        router.stop()
        router.setOption('defaultRoute', null)
        router.start('/not-existing', function(err) {
            expect(err.code).toBe(errorCodes.ROUTE_NOT_FOUND)
            done()
        })
    })

    it('should not match an URL with extra trailing slashes', done => {
        router.setOption('strictTrailingSlash', true)
        router.stop()
        router.start('/users/list/', function(err, state) {
            expect(err.code).toBe(errorCodes.ROUTE_NOT_FOUND)
            expect(state).toBe(null)
            router.setOption('strictTrailingSlash', false)
            done()
        })
    })

    it('should match an URL with extra trailing slashes', done => {
        router.stop()
        router.start('/users/list/', function(err, state) {
            expect(omitMeta(state)).toEqual({
                name: 'users.list',
                params: {},
                path: '/users/list'
            })
            done()
        })
    })

    it('should start with the provided state', done => {
        router.stop()
        router.start(homeState, function(err, state) {
            expect(state).toEqual(homeState)
            expect(router.getState()).toEqual(homeState)
            done()
        })
    })

    it('should not reuse id when starting with provided state', done => {
        router.stop()
        expect(homeState.meta.id).toEqual(1)
        router.start(homeState, function() {
            router.navigate('users', function(err, state) {
                expect(state.meta.id).not.toEqual(1)
                done()
            })
        })
    })

    it('should return an error if default route access is not found', done => {
        router.stop()
        router.setOption('defaultRoute', 'fake.route')

        router.start('/not-existing', function(err) {
            expect(err.code).toBe(errorCodes.ROUTE_NOT_FOUND)
            done()
        })
    })

    it('should be able to stop routing', done => {
        router.navigate('users', function() {
            router.stop()
            expect(router.isStarted()).toBe(false)
            router.navigate('users.list', function(err) {
                expect(err.code).toBe(errorCodes.ROUTER_NOT_STARTED)
                // Stopping again shouldn't throw an error
                router.stop()
                router.start('', () => done())
            })
        })
    })
})
