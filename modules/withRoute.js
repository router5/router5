import { Component, createElement } from 'react';
import * as invariant from 'invariant';

function withRoute(BaseComponent) {
    class ComponentWithRoute extends Component {
        constructor(props, context) {
            super(props, context);
            this.router = context.router;
            this.state = {
                previousRoute: null,
                route: this.router.getState()
            };
        }

        componentDidMount() {
            invariant(
                this.router.registeredPlugins.LISTENERS,
                '[react-router5] missing plugin router5-listeners.'
            );

            this.listener = (toState, fromState) => this.setState({ previousRoute: fromState, route: toState });
            this.router.addListener(this.nodeListener);
        }

        componentWillUnmout() {
            this.router.removeListener(this.listener);
        }

        render() {
            invariant(
                !props.router && !props.route && !props.previousRoute,
                '[react-router5] prop names `router`, `route` and `previousRoute` are reserved.'
            );

            return createElement(BaseComponent, { ...props, ...this.state, router: this.router });
        }
    }

    return ComponentWithRoute;
}

export default withRoute;
