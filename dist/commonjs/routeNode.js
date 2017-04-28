'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _utils = require('./utils');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function routeNode(nodeName) {
    return function routeNodeWrapper(RouteSegment) {
        var RouteNode = function (_Component) {
            _inherits(RouteNode, _Component);

            function RouteNode(props, context) {
                _classCallCheck(this, RouteNode);

                var _this = _possibleConstructorReturn(this, (RouteNode.__proto__ || Object.getPrototypeOf(RouteNode)).call(this, props, context));

                _this.router = context.router;
                _this.state = {
                    previousRoute: null,
                    route: _this.router.getState()
                };
                return _this;
            }

            _createClass(RouteNode, [{
                key: 'componentDidMount',
                value: function componentDidMount() {
                    var _this2 = this;

                    (0, _utils.ifNot)(this.router.hasPlugin('LISTENERS_PLUGIN'), '[react-router5][routeNode] missing listeners plugin');

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

                    var component = (0, _react.createElement)(RouteSegment, _extends({}, props, { router: router, previousRoute: previousRoute, route: route }));

                    return component;
                }
            }]);

            return RouteNode;
        }(_react.Component);

        RouteNode.contextTypes = {
            router: _propTypes2.default.object.isRequired
        };

        RouteNode.displayName = 'RouteNode[' + (0, _utils.getDisplayName)(RouteSegment) + ']';

        return RouteNode;
    };
}

exports.default = routeNode;