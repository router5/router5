import createRouter, { RouteNode } from '../modules';

const usersRoute = new RouteNode('users', '/users', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('list', '/list')
]);

const ordersRoute = new RouteNode('orders', '/orders', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('pending', '/pending'),
    new RouteNode('completed', '/completed')
]);

const sectionRoute = new RouteNode('section', '/:section<section[\\d]+>', [
    new RouteNode('view', '/view/:id'),
    new RouteNode('query', '/query?param1[]&param2&param3')
]);

export default function createTestRouter() {
    return createRouter([
            usersRoute,
            sectionRoute
        ], {
            defaultRoute: 'home'
        })
        .add(ordersRoute)
        .addNode('index', '/')
        .addNode('home', '/home')
        .addNode('admin', '/admin', () => () => false)
        .addNode('sign-in', '/sign-in')
        .addNode('auth-protected', '/auth-protected', () => () => new Promise((resolve, reject) => reject({ redirect: { name: 'sign-in' }})));
}
