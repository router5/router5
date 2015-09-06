import {Router5} from 'router5'

export default function createRouter(routes) {
    let router = new Router5([], {
        useHash: true,
        defaultRoute: 'inbox'
    });

    routes.forEach(route => router.addNode(route.name, route.path, route.canActivate));

    return router;
};
