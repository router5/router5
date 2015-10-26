'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reselect = require('reselect');

var _router5TransitionPath = require('router5.transition-path');

var _router5TransitionPath2 = _interopRequireDefault(_router5TransitionPath);

function routeNodeSelector(routeNode) {
    var reducerKey = arguments.length <= 1 || arguments[1] === undefined ? 'router' : arguments[1];

    var routerStateSelector = function routerStateSelector(state) {
        return state[reducerKey];
    };

    var routeIntersectionSelector = (0, _reselect.createSelector)(routerStateSelector, function (_ref) {
        var route = _ref.route;
        var previousRoute = _ref.previousRoute;

        var intersection = route ? (0, _router5TransitionPath2['default'])(route, previousRoute).intersection : '';
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

exports['default'] = routeNodeSelector;
module.exports = exports['default'];