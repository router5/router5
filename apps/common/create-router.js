import { Router5 } from 'router5'
import listenersPlugin from 'router5-listeners';
import historyPlugin from 'router5-history';

export default function createRouter(routes) {
    let router = new Router5([], {
            useHash: true,
            defaultRoute: 'home'
        })
        .usePlugin(listenersPlugin())
        .usePlugin(historyPlugin())
        .useMiddleware((toState, fromState, done) => {
            done(null);
        });

    routes.forEach(route => router.addNode(route.name, route.path, route.canActivate));

    return router;
};
