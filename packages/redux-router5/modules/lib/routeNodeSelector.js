import { shouldUpdateNode } from 'router5-transition-path'

function routeNodeSelector(routeNode, reducerKey = 'router') {
    const routerStateSelector = state =>
        state[reducerKey] || (state.get && state.get(reducerKey))
    let lastReturnedValue

    return function(state) {
        const { route, previousRoute } = routerStateSelector(state)
        const shouldUpdate = !route
            ? true
            : shouldUpdateNode(routeNode)(route, previousRoute)

        if (!lastReturnedValue) {
            lastReturnedValue = { route, previousRoute }
        } else if (
            !previousRoute ||
            (previousRoute !== route && shouldUpdate)
        ) {
            lastReturnedValue = { route, previousRoute }
        }

        return lastReturnedValue
    }
}

export default routeNodeSelector
