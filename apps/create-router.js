import Router5 from 'router5';
import loggerPlugin from 'router5/plugins/logger';
import listenersPlugin from 'router5/plugins/listeners';
import browserPlugin from 'router5/plugins/browser';
import routes from './routes';

export default function createRouter(useListenersPlugin = false) {
    const router = new Router5(routes)
        .setOption('useHash', true)
        .setOption('defaultRoute', 'inbox')
        // Plugins
        .usePlugin(loggerPlugin)
        .usePlugin(browserPlugin());

    if (useListenersPlugin) {
        router.usePlugin(listenersPlugin());
    }

    return router;
}

export default createRouter;
