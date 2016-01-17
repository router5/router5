import React, { Component, PropTypes, createElement } from 'react';
import { getDisplayName, ifNot } from './utils';

function routeNode(nodeName, register = false) {
    return function routeNodeWrapper(RouteSegment) {
        class RouteNode extends Component {
            constructor(props, context) {
                super(props, context);
                this.router = context.router;
                this.state = {
                    previousRoute: null,
                    route: this.router.getState()
                };
            }

            componentDidMount() {
                if (register && this.refs.wrappedInstance && this.refs.wrappedInstance.canDeactivate) {
                    this.router.canDeactivate(nodeName, this.refs.wrappedInstance.canDeactivate);
                }

                ifNot(
                    this.router.registeredPlugins.LISTENERS,
                    '[react-router5][routeNode] missing plugin router5-listeners'
                );

                this.nodeListener = (toState, fromState) => this.setState({ previousRoute: fromState, route: toState });
                this.router.addNodeListener(nodeName, this.nodeListener);
            }

            componentWillUnmout() {
                this.router.removeNodeListener(nodeName, this.nodeListener);
            }

            render() {
                const { props, router } = this;
                const { previousRoute, route } = this.state;
                const component = createElement(
                    RouteSegment,
                    {...props, router, previousRoute, route, ref: register ? 'wrappedInstance' : undefined }
                );

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
