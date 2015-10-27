'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _router5Middleware = require('./router5Middleware');

var _router5Middleware2 = _interopRequireDefault(_router5Middleware);

var _router5Reducer = require('./router5Reducer');

var _router5Reducer2 = _interopRequireDefault(_router5Reducer);

var _routeNodeSelector = require('./routeNodeSelector');

var _routeNodeSelector2 = _interopRequireDefault(_routeNodeSelector);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _actionTypes = require('./actionTypes');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

exports['default'] = {
    router5Middleware: _router5Middleware2['default'],
    router5Reducer: _router5Reducer2['default'],
    actions: actions,
    actionTypes: _actionTypes2['default'],
    routeNodeSelector: _routeNodeSelector2['default']
};
module.exports = exports['default'];