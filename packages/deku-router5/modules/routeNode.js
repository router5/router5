function routeNode(nodeName) {
    return function routeNodeWrapper(RouteSegment) {
        const RouteNode = {
            propTypes: {
                router: { source: 'router' }
            },

            afterMount({ props }, elm, setState) {
                props.router.addNodeListener(nodeName, (toState, fromState) => {
                    setState({ route: toState, previousRoute: fromState });
                });
            },

            render({ props, state }) {
                let { route, previousRoute } = state;

                if (route === undefined) {
                    route = props.router.getState();
                    previousRoute = null;
                }

                return {
                    type: RouteSegment,
                    children: [],
                    attributes: { ...props, route, previousRoute }
                };
            }
        };

        return RouteNode;
    };
}

export default routeNode;
