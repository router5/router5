import Router5 from 'router5'
import historyPlugin from 'router5-history';

export default function createRouter(routes) {
    const router = new Router5()
        .setOption('useHash', true)
        // .setOption('hashPrefix', '!')
        .setOption('defaultRoute', 'inbox')
        // Routes
        .addNode('inbox',         '/inbox')
        .addNode('inbox.message', '/message/:id')
        .addNode('compose',       '/compose')
        .addNode('contacts',      '/contacts')
        // Plugins
        .usePlugin(historyPlugin());

    return router;
};
