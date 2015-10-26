import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import transitionPath from 'router5.transition-path';

function routeNodeSelector(routeNode, reducerKey = 'router') {
    const routerStateSelector = state => state[reducerKey];

    const routeIntersectionSelector = createSelector(
        routerStateSelector,
        ({ route, previousRoute }) => {
            const intersection = route ? transitionPath(route, previousRoute).intersection : '';
            return { route, intersection };
        }
    );

    // We trick the selector to think that no change happenned if the intersection of an update
    // is not the defined routeNode.
    const createIntersectionSelector = createSelectorCreator(
        defaultMemoize,
        ({ intersection, route }, previous) => previous.route === route || intersection !== routeNode
    );

    return createIntersectionSelector(
        routeIntersectionSelector,
        ({ route }) => ({ route })
    );
}

export default routeNodeSelector;
