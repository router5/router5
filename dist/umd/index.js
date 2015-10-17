(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './router5', 'route-node', './plugins/listeners'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./router5'), require('route-node'), require('./plugins/listeners'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Router5, global.RouteNode, global.listenersPlugin);
    global.index = mod.exports;
  }
})(this, function (exports, module, _router5, _routeNode, _pluginsListeners) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Router5 = _interopRequireDefault(_router5);

  var _RouteNode = _interopRequireDefault(_routeNode);

  var _listenersPlugin = _interopRequireDefault(_pluginsListeners);

  module.exports = { Router5: _Router5['default'], RouteNode: _RouteNode['default'], listenersPlugin: _listenersPlugin['default'] };
});