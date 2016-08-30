import transitionPath from 'router5.transition-path';

const initialValue = { route: null, previousRoute: null };

function routeNodeSelector(routeNode, reducerKey = 'router') {
    const routerStateSelector = state => state[reducerKey];
    let lastReturnedValue = initialValue;

    return function(state) {
        const { route, previousRoute } = routerStateSelector(state);
        const intersection = route ? transitionPath(route, previousRoute).intersection : '';

        if (!previousRoute || previousRoute !== route && intersection === routeNode) {
            lastReturnedValue = { route, previousRoute };
        }

        return lastReturnedValue;
    };
}

export default routeNodeSelector;
