(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module,
            require('..').Router5,
            require('..').RouteNode,
            require('..').listenersPlugin
        );
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.Router5, global.RouteNode, global.listenersPlugin);
        global.createRouter = mod.exports;
    }
})(this, function (exports, module, Router5, RouteNode, listenersPlugin) {
    'use strict';

    module.exports = createRouter;

    var usersRoute = new RouteNode('users', '/users', [
        new RouteNode('view', '/view/:id'),
        new RouteNode('list', '/list')
    ]);

    var ordersRoute = new RouteNode('orders', '/orders', [
        new RouteNode('view', '/view/:id'),
        new RouteNode('pending', '/pending'),
        new RouteNode('completed', '/completed')
    ]);

    var sectionRoute = new RouteNode('section', '/:section<section[\\d]+>', [
        new RouteNode('view', '/view/:id'),
        new RouteNode('query', '/query?param2&param3')
    ]);

    function createRouter(base, useHash, hashPrefix) {
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
            .addNode('admin', '/admin',   function canActivate() { return false; })
            .usePlugin(listenersPlugin());
    }
});

