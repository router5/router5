'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _router = require('router5.transition-path');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routeNodeSelector(routeNode) {
    var reducerKey = arguments.length <= 1 || arguments[1] === undefined ? 'router' : arguments[1];

    var routerStateSelector = function routerStateSelector(state) {
        return state[reducerKey];
    };
    var lastReturnedValue = void 0;

    return function (state) {
        var _routerStateSelector = routerStateSelector(state);

        var route = _routerStateSelector.route;
        var previousRoute = _routerStateSelector.previousRoute;

        var intersection = route ? (0, _router2.default)(route, previousRoute).intersection : '';

        if (!lastReturnedValue) {
            lastReturnedValue = { route: route, previousRoute: previousRoute };
        } else if (!previousRoute || previousRoute !== route && intersection === routeNode) {
            lastReturnedValue = { route: route, previousRoute: previousRoute };
        }

        return lastReturnedValue;
    };
}

exports.default = routeNodeSelector;