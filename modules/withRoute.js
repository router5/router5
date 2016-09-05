import React, { Component, createElement } from 'react';
import { ifNot, getDisplayName } from './utils';

function withRoute(BaseComponent) {
    class ComponentWithRoute extends Component {
        constructor(props, context) {
            super(props, context);
            this.router = context.router;
            this.state = {
                previousRoute: null,
                route: this.router.getState()
            };
            this.listener = this.listener.bind(this);
        }

        componentDidMount() {
            ifNot(
                this.router.hasPlugin('LISTENERS_PLUGIN'),
                '[react-router5][withRoute] missing listeners plugin'
            );

            this.listener = (toState, fromState) => this.setState({ previousRoute: fromState, route: toState });
            this.router.addListener(this.listener);
        }

        componentWillUnmount() {
            this.router.removeListener(this.listener);
        }

        listener(toState, fromState) {
            this.setState({
                previousRoute: fromState,
                route: toState
            });
        }

        render() {
            ifNot(
                !this.props.router && !this.props.route && !this.props.previousRoute,
                '[react-router5] prop names `router`, `route` and `previousRoute` are reserved.'
            );

            return createElement(BaseComponent, { ...this.props, ...this.state, router: this.router });
        }
    }

    ComponentWithRoute.contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    ComponentWithRoute.displayName = 'WithRoute[' + getDisplayName(BaseComponent) + ']';

    return ComponentWithRoute;
}

export default withRoute;
