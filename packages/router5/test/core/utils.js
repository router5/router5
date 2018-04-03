import { expect } from 'chai'
import createTestRouter from '../_create-router'
import { omitMeta } from '../_helpers'

describe('core/utils', () => {
    let router

    context('with strictQueryParams', () => {
        before(
            () =>
                (router = createTestRouter()
                    .clone()
                    .start())
        )
        after(() => router.stop())

        it('should expose RouteNode path building function', function() {
            expect(router.buildPath('users.list')).to.equal('/users/list')
        })

        it('should tell if a route is active or not', function() {
            router.navigate('users.view', { id: 1 })
            expect(router.isActive('users.view', { id: 1 })).to.equal(true)
            expect(router.isActive('users.view', { id: 2 })).to.equal(false)
            expect(router.isActive('users.view')).to.equal(false)
            expect(router.isActive('users')).to.equal(true)
            expect(router.isActive('users', {}, true)).to.equal(false)

            router.navigate('section.query', { section: 'section1' })
            expect(
                router.isActive('section', { section: 'section1' })
            ).to.equal(true)
            expect(
                router.isActive('section.query', {
                    section: 'section1',
                    param1: '123'
                })
            ).to.equal(true)
            expect(
                router.isActive('section.query', { section: 'section2' })
            ).to.equal(false)
            expect(
                router.isActive(
                    'section.query',
                    { section: 'section1', param2: '123' },
                    false,
                    false
                )
            ).to.equal(false)
            expect(router.isActive('users.view', { id: 123 })).to.equal(false)
        })

        it('should decode path params on match', () => {
            expect(omitMeta(router.matchPath('/encoded/hello/123'))).to.eql({
                name: 'withEncoder',
                params: {
                    one: 'hello',
                    two: '123'
                },
                path: '/encoded/hello/123'
            })
        })

        it('should match deep `/` routes', function() {
            router.setOption('trailingSlashMode', 'never')
            expect(omitMeta(router.matchPath('/profile'))).to.eql({
                name: 'profile.me',
                params: {},
                path: '/profile'
            })

            router.setOption('trailingSlashMode', 'always')
            expect(omitMeta(router.matchPath('/profile'))).to.eql({
                name: 'profile.me',
                params: {},
                path: '/profile/'
            })
        })
    })

    context('without strict query params mode', () => {
        before(
            () =>
                (router = createTestRouter({ queryParamsMode: 'loose' })
                    .clone()
                    .start())
        )
        after(() => router.stop())

        it('should build paths with extra parameters', () => {
            expect(
                router.buildPath('users.view', {
                    id: '123',
                    username: 'thomas'
                })
            ).to.equal('/users/view/123?username=thomas')
        })
    })
})
