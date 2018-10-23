import { expect } from 'chai'
import createTestRouter from '../_create-router'
import { omitMeta } from '../_helpers'
import createRouter from '../../modules'

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

    context('with non default query params format', () => {
        before(() => {
            router = createRouter(
                [
                    {
                        name: 'query',
                        path: '/query?param1&param2'
                    }
                ],
                {
                    queryParamsMode: 'loose',
                    queryParams: {
                        booleanFormat: 'unicode'
                    }
                }
            )
        })
        after(() => router.stop())

        it('should build paths', () => {
            expect(
                router.buildPath('query', {
                    param1: true,
                    param2: false
                })
            ).to.equal('/query?param1=✓&param2=✗')
        })

        it('should match paths', () => {
            const match = router.matchPath('/query?param1=✓&param2=✗')

            expect(match.params).to.eql({
                param1: true,
                param2: false
            })
        })

        it('should match on start', () => {
            router.start('/query?param1=✓&param2=✗', (err, state) => {
                expect(state.params).to.eql({
                    param1: true,
                    param2: false
                })
            })
        })
    })

    it('should build path with default parameters', () => {
        const router = createRouter({
            name: 'withDefaults',
            defaultParams: { id: '1' },
            path: '/with-defaults/:id'
        })

        expect(router.buildPath('withDefaults')).to.equal('/with-defaults/1')
        expect(router.makeState('withDefaults').params).to.eql({ id: '1' })
    })
})
