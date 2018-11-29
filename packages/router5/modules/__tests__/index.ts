import createRouter from '../'
import RouteNode from 'route-node'

describe('router5', () => {
    describe('createRouter', () => {
        it('should not throw', () => {
            expect(() => createRouter()).not.toThrow()
        })

        describe('with routes', () => {
            it('should accept a flat list of nested routes', () => {
                const router = createRouter([
                    {
                        name: 'home',
                        path: '/home'
                    },
                    {
                        name: 'home.dashboard',
                        path: '/dashboard'
                    },
                    {
                        name: 'home.notifications',
                        path: '/notifications'
                    }
                ])

                expect(router.buildPath('home')).toBe('/home')
                expect(router.buildPath('home.dashboard')).toBe(
                    '/home/dashboard'
                )
                expect(router.buildPath('home.notifications')).toBe(
                    '/home/notifications'
                )
            })

            it('should accept a list of routes with children', () => {
                const router = createRouter([
                    {
                        name: 'home',
                        path: '/home',
                        children: [
                            {
                                name: 'dashboard',
                                path: '/dashboard'
                            },
                            {
                                name: 'notifications',
                                path: '/notifications'
                            }
                        ]
                    }
                ])

                expect(router.buildPath('home')).toBe('/home')
                expect(router.buildPath('home.dashboard')).toBe(
                    '/home/dashboard'
                )
                expect(router.buildPath('home.notifications')).toBe(
                    '/home/notifications'
                )
            })

            it('should accept a RouteNode', () => {
                const rootNode = new RouteNode('', '', [
                    new RouteNode('home', '/home', [
                        new RouteNode('dashboard', '/dashboard'),
                        new RouteNode('notifications', '/notifications')
                    ])
                ])
                const router = createRouter(rootNode)

                expect(router.buildPath('home')).toBe('/home')
                expect(router.buildPath('home.dashboard')).toBe(
                    '/home/dashboard'
                )
                expect(router.buildPath('home.notifications')).toBe(
                    '/home/notifications'
                )
            })
        })

        describe('with options', () => {
            it('should have default options', () => {
                const router = createRouter([], {}, { store: {} })

                expect(router.getDependencies()).toEqual({
                    store: {}
                })
            })

            it('should accept dependencies', () => {
                const router = createRouter([], {}, { store: {} })

                expect(router.getDependencies()).toEqual({
                    store: {}
                })
            })
        })
    })
})
