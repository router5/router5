import { Component, createElement } from 'react';
import { getDisplayName, ifNot } from './utils';
import PropTypes from 'prop-types';

function routeNode(nodeName) {
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
                ifNot(
                    this.router.hasPlugin('LISTENERS_PLUGIN'),
                    '[react-router5][routeNode] missing listeners plugin'
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
                    {...props, router, previousRoute, route }
                );

                return component;
            }
        }

        RouteNode.contextTypes = {
            router: PropTypes.object.isRequired
        };

        RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';

        return RouteNode;
    };
}

export default routeNode;
