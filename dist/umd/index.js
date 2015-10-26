(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './router5Middleware', './router5Reducer', './routeNodeSelector', './actions', './actionTypes'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./router5Middleware'), require('./router5Reducer'), require('./routeNodeSelector'), require('./actions'), require('./actionTypes'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.router5Middleware, global.router5Reducer, global.routeNodeSelector, global.actions, global.actionTypes);
        global.index = mod.exports;
    }
})(this, function (exports, module, _router5Middleware, _router5Reducer, _routeNodeSelector, _actions, _actionTypes) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _router5Middleware2 = _interopRequireDefault(_router5Middleware);

    var _router5Reducer2 = _interopRequireDefault(_router5Reducer);

    var _routeNodeSelector2 = _interopRequireDefault(_routeNodeSelector);

    var _actions2 = _interopRequireDefault(_actions);

    var _actionTypes2 = _interopRequireDefault(_actionTypes);

    module.exports = {
        router5Middleware: _router5Middleware2['default'],
        router5Reducer: _router5Reducer2['default'],
        actions: _actions2['default'],
        actionTypes: _actionTypes2['default'],
        routeNodeSelector: _routeNodeSelector2['default']
    };
});