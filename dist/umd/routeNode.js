(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', 'react'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('react'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.React);
        global.routeNode = mod.exports;
    }
})(this, function (exports, module, _react) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var _React = _interopRequireDefault(_react);

    function routeNode(nodeName) {
        var register = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        return function routeNodeWrapper(RouteSegment) {
            var RouteNode = (function (_Component) {
                _inherits(RouteNode, _Component);

                function RouteNode(props, context) {
                    var _this = this;

                    _classCallCheck(this, RouteNode);

                    _get(Object.getPrototypeOf(RouteNode.prototype), 'constructor', this).call(this, props, context);
                    this.router = context.router;
                    this.nodeListener = function (toState, fromState) {
                        return _this.setState({ previousRoute: fromState, route: toState });
                    };
                    if (!this.router.registeredPlugins.LISTENERS) {
                        throw new Error('[react-router5][RouteNode] missing plugin router5-listeners.');
                    }
                    this.state = {
                        previousRoute: null,
                        route: router.getState()
                    };
                    this.router.addNodeListener(nodeName, this.nodeListener);
                }

                _createClass(RouteNode, [{
                    key: 'componentDidMount',
                    value: function componentDidMount() {
                        if (register) this.router.registerComponent(nodeName, this.refs.wrappedInstance);
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
                        var _state = this.state;
                        var previousRoute = _state.previousRoute;
                        var route = _state.route;

                        var component = _React['default'].createElement(RouteSegment, _extends({}, props, { previousRoute: previousRoute, route: route, ref: register ? 'wrappedInstance' : undefined }));

                        return component;
                    }
                }]);

                return RouteNode;
            })(_react.Component);

            RouteNode.contextTypes = {
                router: _react.PropTypes.object.isRequired
            };

            return RouteNode;
        };
    }

    module.exports = routeNode;
});