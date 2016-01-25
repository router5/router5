import Router5, { loggerPlugin } from 'router5';
import historyPlugin from 'router5-history';
import linkInterceptorPlugin from './router5/link-interceptor-plugin';

const createRouter = (routes) => {
    return new Router5()
        .add(routes)
        .setOption('useHash', true)
        .setOption('defaultRoute', 'inbox')
        // .usePlugin(loggerPlugin())
        .usePlugin(historyPlugin())
        .usePlugin(linkInterceptorPlugin());
};

export default createRouter;
