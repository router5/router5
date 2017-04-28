import { Component, createElement } from 'react';
import { getDisplayName, ifNot } from './utils';
import PropTypes from 'prop-types';

function routeNode(nodeName) {
    return function routeNodeWrapper(RouteSegment) {
        var RouteNode = function (_Component) {
            babelHelpers.inherits(RouteNode, _Component);

            function RouteNode(props, context) {
                babelHelpers.classCallCheck(this, RouteNode);

                var _this = babelHelpers.possibleConstructorReturn(this, (RouteNode.__proto__ || Object.getPrototypeOf(RouteNode)).call(this, props, context));

                _this.router = context.router;
                _this.state = {
                    previousRoute: null,
                    route: _this.router.getState()
                };
                return _this;
            }

            babelHelpers.createClass(RouteNode, [{
                key: 'componentDidMount',
                value: function componentDidMount() {
                    var _this2 = this;

                    ifNot(this.router.hasPlugin('LISTENERS_PLUGIN'), '[react-router5][routeNode] missing listeners plugin');

                    this.nodeListener = function (toState, fromState) {
                        return _this2.setState({ previousRoute: fromState, route: toState });
                    };
                    this.router.addNodeListener(nodeName, this.nodeListener);
                }
            }, {
                key: 'componentWillUnmout',
                value: function componentWillUnmout() {
                    this.router.removeNodeListener(nodeName, this.nodeListener);
                }
            }, {
                key: 'render',
                value: function render() {
                    var props = this.props,
                        router = this.router;
                    var _state = this.state,
                        previousRoute = _state.previousRoute,
                        route = _state.route;

                    var component = createElement(RouteSegment, babelHelpers.extends({}, props, { router: router, previousRoute: previousRoute, route: route }));

                    return component;
                }
            }]);
            return RouteNode;
        }(Component);

        RouteNode.contextTypes = {
            router: PropTypes.object.isRequired
        };

        RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';

        return RouteNode;
    };
}

export default routeNode;