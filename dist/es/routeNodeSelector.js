import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import transitionPath from 'router5.transition-path';

function routeNodeSelector(routeNode) {
    var reducerKey = arguments.length <= 1 || arguments[1] === undefined ? 'router' : arguments[1];

    var routerStateSelector = function routerStateSelector(state) {
        return state[reducerKey];
    };

    var routeIntersectionSelector = createSelector(routerStateSelector, function (_ref) {
        var route = _ref.route;
        var previousRoute = _ref.previousRoute;

        var intersection = route ? transitionPath(route, previousRoute).intersection : '';
        return { route: route, intersection: intersection };
    });

    // We trick the selector to think that no change happenned if the intersection of an update
    // is not the defined routeNode.
    var createIntersectionSelector = createSelectorCreator(defaultMemoize, function (_ref2, previous) {
        var intersection = _ref2.intersection;
        var route = _ref2.route;
        return previous.route === route || intersection !== routeNode;
    });

    return createIntersectionSelector(routeIntersectionSelector, function (_ref3) {
        var route = _ref3.route;
        return { route: route };
    });
}

export default routeNodeSelector;