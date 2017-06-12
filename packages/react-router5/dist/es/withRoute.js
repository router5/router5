import { Component, createElement } from 'react';
import { ifNot, getDisplayName } from './utils';
import PropTypes from 'prop-types';

function withRoute(BaseComponent) {
    var ComponentWithRoute = function (_Component) {
        babelHelpers.inherits(ComponentWithRoute, _Component);

        function ComponentWithRoute(props, context) {
            babelHelpers.classCallCheck(this, ComponentWithRoute);

            var _this = babelHelpers.possibleConstructorReturn(this, (ComponentWithRoute.__proto__ || Object.getPrototypeOf(ComponentWithRoute)).call(this, props, context));

            _this.router = context.router;
            _this.state = {
                previousRoute: null,
                route: _this.router.getState()
            };
            _this.listener = _this.listener.bind(_this);
            return _this;
        }

        babelHelpers.createClass(ComponentWithRoute, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                ifNot(this.router.hasPlugin('LISTENERS_PLUGIN'), '[react-router5][withRoute] missing listeners plugin');

                this.listener = function (toState, fromState) {
                    return _this2.setState({ previousRoute: fromState, route: toState });
                };
                this.router.addListener(this.listener);
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.router.removeListener(this.listener);
            }
        }, {
            key: 'listener',
            value: function listener(toState, fromState) {
                this.setState({
                    previousRoute: fromState,
                    route: toState
                });
            }
        }, {
            key: 'render',
            value: function render() {
                ifNot(!this.props.router && !this.props.route && !this.props.previousRoute, '[react-router5] prop names `router`, `route` and `previousRoute` are reserved.');

                return createElement(BaseComponent, babelHelpers.extends({}, this.props, this.state, { router: this.router }));
            }
        }]);
        return ComponentWithRoute;
    }(Component);

    ComponentWithRoute.contextTypes = {
        router: PropTypes.object.isRequired
    };

    ComponentWithRoute.displayName = 'WithRoute[' + getDisplayName(BaseComponent) + ']';

    return ComponentWithRoute;
}

export default withRoute;