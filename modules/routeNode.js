import React, { Component, PropTypes } from 'react';

function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}

function routeNode(nodeName, register = false) {
    return function routeNodeWrapper(RouteSegment) {
        class RouteNode extends Component {
            constructor(props, context) {
                super(props, context);
                this.router = context.router;
                this.nodeListener = (toState, fromState) => this.setState({ previousRoute: fromState, route: toState });
                if (!this.router.registeredPlugins.LISTENERS) {
                    throw new Error('[react-router5][RouteNode] missing plugin router5-listeners.');
                }
                this.state = {
                    previousRoute: null,
                    route: this.router.getState()
                };
                this.router.addNodeListener(nodeName, this.nodeListener);
            }

            componentDidMount() {
                if (register) this.router.registerComponent(nodeName, this.refs.wrappedInstance);
            }

            componentWillUnmout() {
                this.router.removeNodeListener(nodeName, this.nodeListener);
            }

            render() {
                const props = this.props;
                const { previousRoute, route } = this.state;
                const component = React.createElement(RouteSegment, {...props, previousRoute, route, ref: register ? 'wrappedInstance' : undefined});

                return component;
            }
        }

        RouteNode.contextTypes = {
            router:       PropTypes.object.isRequired
        };

        RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';

        return RouteNode;
    };
}

export default routeNode;
