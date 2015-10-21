(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './Link', './route-node', './Router'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./Link'), require('./route-node'), require('./Router'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.Link, global.routeNode, global.Router);
        global.index = mod.exports;
    }
})(this, function (exports, module, _Link, _routeNode, _Router) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _Link2 = _interopRequireDefault(_Link);

    var _routeNode2 = _interopRequireDefault(_routeNode);

    var _Router2 = _interopRequireDefault(_Router);

    module.exports = {
        Link: _Link2['default'],
        routeNode: _routeNode2['default'],
        Router: _Router2['default']
    };
});