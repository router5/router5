(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './Link', './route-node'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./Link'), require('./route-node'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.Link, global.routeNode);
        global.index = mod.exports;
    }
})(this, function (exports, module, _Link, _routeNode) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Link2 = _interopRequireDefault(_Link);

    var _routeNode2 = _interopRequireDefault(_routeNode);

    module.exports = {
        Link: _Link2['default'],
        routeNode: _routeNode2['default']
    };
});