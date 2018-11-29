import { createTestRouter, omitMeta } from './helpers'
import createRouter from '../'

describe('core/utils', () => {
    let router

    describe('with strictQueryParams', () => {
        beforeAll(() => (router = createTestRouter().start()))
        afterAll(() => router.stop())

        it('should expose RouteNode path building function', function() {
            expect(router.buildPath('users.list')).toBe('/users/list')
        })

        it('should tell if a route is active or not', function() {
            router.navigate('users.view', { id: 1 })
            expect(router.isActive('users.view', { id: 1 })).toBe(true)
            expect(router.isActive('users.view', { id: 2 })).toBe(false)
            expect(router.isActive('users.view')).toBe(false)
            expect(router.isActive('users')).toBe(true)
            expect(router.isActive('users', {}, true)).toBe(false)

            router.navigate('section.query', { section: 'section1' })
            expect(router.isActive('section', { section: 'section1' })).toBe(
                true
            )
            expect(
                router.isActive('section.query', {
                    section: 'section1',
                    param1: '123'
                })
            ).toBe(true)
            expect(
                router.isActive('section.query', { section: 'section2' })
            ).toBe(false)
            expect(
                router.isActive(
                    'section.query',
                    { section: 'section1', param2: '123' },
                    false,
                    false
                )
            ).toBe(false)
            expect(router.isActive('users.view', { id: 123 })).toBe(false)
        })

        it('should decode path params on match', () => {
            expect(omitMeta(router.matchPath('/encoded/hello/123'))).toEqual({
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
            expect(omitMeta(router.matchPath('/profile'))).toEqual({
                name: 'profile.me',
                params: {},
                path: '/profile'
            })

            router.setOption('trailingSlashMode', 'always')
            expect(omitMeta(router.matchPath('/profile'))).toEqual({
                name: 'profile.me',
                params: {},
                path: '/profile/'
            })
        })
    })

    describe('without strict query params mode', () => {
        beforeAll(
            () =>
                (router = createTestRouter({
                    queryParamsMode: 'loose'
                }).start())
        )
        afterAll(() => router.stop())

        it('should build paths with extra parameters', () => {
            expect(
                router.buildPath('users.view', {
                    id: '123',
                    username: 'thomas'
                })
            ).toBe('/users/view/123?username=thomas')
        })
    })

    describe('with non default query params format', () => {
        beforeAll(() => {
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
        afterAll(() => router.stop())

        it('should build paths', () => {
            expect(
                router.buildPath('query', {
                    param1: true,
                    param2: false
                })
            ).toBe('/query?param1=✓&param2=✗')
        })

        it('should match paths', () => {
            const match = router.matchPath('/query?param1=✓&param2=✗')

            expect(match.params).toEqual({
                param1: true,
                param2: false
            })
        })

        it('should match on start', () => {
            router.start('/query?param1=✓&param2=✗', (err, state) => {
                expect(state.params).toEqual({
                    param1: true,
                    param2: false
                })
            })
        })
    })

    it('should build path with default parameters', () => {
        const router = createRouter([
            {
                name: 'withDefaults',
                defaultParams: { id: '1' },
                path: '/with-defaults/:id'
            }
        ])

        expect(router.buildPath('withDefaults')).toBe('/with-defaults/1')
        expect(router.makeState('withDefaults').params).toEqual({ id: '1' })
    })
})
