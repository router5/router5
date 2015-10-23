import { Router5 } from 'router5';
import listenersPlugin from 'router5-listeners';
import historyPlugin from 'router5-history';

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
    .usePlugin(Router5.loggerPlugin())
    .usePlugin(listenersPlugin())
    .usePlugin(historyPlugin());

export default router;
