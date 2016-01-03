import { Router5, RouteNode } from '../modules';

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
    new RouteNode('query', '/query?param2&param3')
]);

export default function createRouter(base, useHash, hashPrefix) {
    return new Router5([
            usersRoute,
            sectionRoute
        ], {
            defaultRoute: 'home'
        })
        .setOption('useHash', useHash)
        .setOption('hashPrefix', hashPrefix)
        .setOption('base', base)
        .add(ordersRoute)
        .addNode('index', '/')
        .addNode('home', '/home')
        .addNode('admin', '/admin',   function canActivate() { return false; });
}
