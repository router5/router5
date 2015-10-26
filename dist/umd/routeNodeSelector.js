(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', 'reselect', 'router5.transition-path'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('reselect'), require('router5.transition-path'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.reselect, global.transitionPath);
        global.routeNodeSelector = mod.exports;
    }
})(this, function (exports, module, _reselect, _router5TransitionPath) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _transitionPath = _interopRequireDefault(_router5TransitionPath);

    function routeNodeSelector(routeNode) {
        var reducerKey = arguments.length <= 1 || arguments[1] === undefined ? 'router' : arguments[1];

        var routerStateSelector = function routerStateSelector(state) {
            return state[reducerKey];
        };

        var routeIntersectionSelector = (0, _reselect.createSelector)(routerStateSelector, function (_ref) {
            var route = _ref.route;
            var previousRoute = _ref.previousRoute;

            var intersection = route ? (0, _transitionPath['default'])(route, previousRoute).intersection : '';
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

    module.exports = routeNodeSelector;
});