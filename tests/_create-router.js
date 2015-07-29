(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require(require('path').join(__dirname, '../dist/commonjs')).Router5, require('route-node'));
    } else {
        var mod = {
            exports: {}
        };
        console.log(global.RouteNode);
        factory(mod.exports, mod, global.Router5, global.RouteNode);
        global.createRouter = mod.exports;
    }
})(this, function (exports, module, Router5, RouteNode) {
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
        new RouteNode('view', '/view/:id')
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
            .addNode('admin', '/admin',   function canActivate() { return false; });
    }
});

