import { Component, PropTypes, createElement } from 'react';
import { getDisplayName, ifNot } from './utils';

function routeNode(nodeName) {
    var register = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    return function routeNodeWrapper(RouteSegment) {
        var RouteNode = (function (_Component) {
            babelHelpers.inherits(RouteNode, _Component);

            function RouteNode(props, context) {
                babelHelpers.classCallCheck(this, RouteNode);

                var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RouteNode).call(this, props, context));

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

                    if (register && this.refs.wrappedInstance && this.refs.wrappedInstance.canDeactivate) {
                        this.router.canDeactivate(nodeName, this.refs.wrappedInstance.canDeactivate);
                    }

                    ifNot(this.router.registeredPlugins.LISTENERS, '[react-router5][routeNode] missing plugin router5-listeners');

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
                    var props = this.props;
                    var router = this.router;
                    var _state = this.state;
                    var previousRoute = _state.previousRoute;
                    var route = _state.route;

                    var component = createElement(RouteSegment, babelHelpers.extends({}, props, { router: router, previousRoute: previousRoute, route: route, ref: register ? 'wrappedInstance' : undefined }));

                    return component;
                }
            }]);
            return RouteNode;
        })(Component);

        RouteNode.contextTypes = {
            router: PropTypes.object.isRequired
        };

        RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';

        return RouteNode;
    };
}

export default routeNode;