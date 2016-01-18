'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reselect = require('reselect');

var _router = require('router5.transition-path');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routeNodeSelector(routeNode) {
    var reducerKey = arguments.length <= 1 || arguments[1] === undefined ? 'router' : arguments[1];

    var routerStateSelector = function routerStateSelector(state) {
        return state[reducerKey];
    };

    var routeIntersectionSelector = (0, _reselect.createSelector)(routerStateSelector, function (_ref) {
        var route = _ref.route;
        var previousRoute = _ref.previousRoute;

        var intersection = route ? (0, _router2.default)(route, previousRoute).intersection : '';
        return { route: route, intersection: intersection };
    });

    // We trick the selector to think that no change happenned if the intersection of an update
    // is not the defined routeNode.
    var createIntersectionSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, function (_ref2, previous) {
        var intersection = _ref2.intersection;
        var route = _ref2.route;
        return previous.route === route || intersection !== routeNode;
    });

    return createIntersectionSelector(routeIntersectionSelector, function (_ref3) {
        var route = _ref3.route;
        return { route: route };
    });
}

exports.default = routeNodeSelector;