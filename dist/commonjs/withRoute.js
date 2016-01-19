'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function withRoute(BaseComponent) {
    var ComponentWithRoute = (function (_Component) {
        _inherits(ComponentWithRoute, _Component);

        function ComponentWithRoute(props, context) {
            _classCallCheck(this, ComponentWithRoute);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentWithRoute).call(this, props, context));

            _this.router = context.router;
            _this.state = {
                previousRoute: null,
                route: _this.router.getState()
            };
            _this.listener = _this.listener.bind(_this);
            return _this;
        }

        _createClass(ComponentWithRoute, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                (0, _utils.ifNot)(this.router.registeredPlugins.LISTENERS, '[react-router5][withRoute] missing plugin router5-listeners');

                this.listener = function (toState, fromState) {
                    return _this2.setState({ previousRoute: fromState, route: toState });
                };
                this.router.addListener(this.listener);
            }
        }, {
            key: 'componentWillUnmout',
            value: function componentWillUnmout() {
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
                (0, _utils.ifNot)(!this.props.router && !this.props.route && !this.props.previousRoute, '[react-router5] prop names `router`, `route` and `previousRoute` are reserved.');

                return (0, _react.createElement)(BaseComponent, _extends({}, this.props, this.state, { router: this.router }));
            }
        }]);

        return ComponentWithRoute;
    })(_react.Component);

    ComponentWithRoute.contextTypes = {
        router: _react.PropTypes.object.isRequired
    };

    ComponentWithRoute.displayName = 'WithRoute[' + (0, _utils.getDisplayName)(BaseComponent) + ']';

    return ComponentWithRoute;
}

exports.default = withRoute;