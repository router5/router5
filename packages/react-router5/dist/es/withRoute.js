var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component, createElement } from 'react';
import { ifNot, getDisplayName } from './utils';
import PropTypes from 'prop-types';

function withRoute(BaseComponent) {
    var ComponentWithRoute = function (_Component) {
        _inherits(ComponentWithRoute, _Component);

        function ComponentWithRoute(props, context) {
            _classCallCheck(this, ComponentWithRoute);

            var _this = _possibleConstructorReturn(this, (ComponentWithRoute.__proto__ || Object.getPrototypeOf(ComponentWithRoute)).call(this, props, context));

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

                return createElement(BaseComponent, _extends({}, this.props, this.state, { router: this.router }));
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