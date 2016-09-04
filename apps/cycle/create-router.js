import Router5, { loggerPlugin } from 'router5';
import browserPlugin from 'router5/plugins/browser';

const createRouter = (routes) => {
    return new Router5()
        .add(routes)
        .setOption('useHash', true)
        .setOption('defaultRoute', 'inbox')
        .usePlugin(loggerPlugin)
        .usePlugin(browserPlugin());
};

export default createRouter;
