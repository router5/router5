(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './Router5', 'route-node'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./Router5'), require('route-node'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Router5, global.RouteNode);
    global.index = mod.exports;
  }
})(this, function (exports, module, _Router5, _routeNode) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Router52 = _interopRequireDefault(_Router5);

  var _RouteNode = _interopRequireDefault(_routeNode);

  module.exports = { Router5: _Router52['default'], RouteNode: _RouteNode['default'] };
});