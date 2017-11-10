import createRouter, { RouteNode } from '../modules'

const usersRoute = new RouteNode('users', '/users', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('list', '/list')
])

const ordersRoute = new RouteNode('orders', '/orders', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('pending', '/pending'),
    new RouteNode('completed', '/completed')
])

const sectionRoute = new RouteNode('section', '/:section<section[\\d]+>', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('query', '/query?param1[]&param2&param3')
])

const profileRoute = new RouteNode('profile', '/profile', [
    { name: 'me', path: '/' },
    { name: 'user', path: '/:userId' }
])

export default function createTestRouter(options) {
    return createRouter([usersRoute, sectionRoute, profileRoute], {
        defaultRoute: 'home',
        ...options
    })
        .add(ordersRoute)
        .addNode('index', '/')
        .addNode('home', '/home')
        .addNode('admin', '/admin', () => () => false)
        .addNode('sign-in', '/sign-in')
        .addNode('auth-protected', '/auth-protected', () => () =>
            new Promise((resolve, reject) =>
                reject({ redirect: { name: 'sign-in' } })
            )
        )
}
