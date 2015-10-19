(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './router5', 'route-node'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./router5'), require('route-node'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Router5, global.RouteNode);
    global.index = mod.exports;
  }
})(this, function (exports, module, _router5, _routeNode) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Router5 = _interopRequireDefault(_router5);

  var _RouteNode = _interopRequireDefault(_routeNode);

  module.exports = { Router5: _Router5['default'], RouteNode: _RouteNode['default'] };
});