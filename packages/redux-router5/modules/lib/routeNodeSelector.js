import transitionPath from 'router5.transition-path';

function routeNodeSelector(routeNode, reducerKey = 'router') {
    const routerStateSelector = state =>
        state[reducerKey] || (state.get && state.get(reducerKey));
    let lastReturnedValue;

    return function(state) {
        const { route, previousRoute } = routerStateSelector(state);
        const intersection = route
            ? transitionPath(route, previousRoute).intersection
            : '';

        if (!lastReturnedValue) {
            lastReturnedValue = { route, previousRoute };
        } else if (
            !previousRoute ||
            (previousRoute !== route && intersection === routeNode)
        ) {
            lastReturnedValue = { route, previousRoute };
        }

        return lastReturnedValue;
    };
}

export default routeNodeSelector;
