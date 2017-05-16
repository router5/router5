'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RouterProvider = function (_Component) {
    _inherits(RouterProvider, _Component);

    function RouterProvider(props, context) {
        _classCallCheck(this, RouterProvider);

        var _this = _possibleConstructorReturn(this, (RouterProvider.__proto__ || Object.getPrototypeOf(RouterProvider)).call(this, props, context));

        _this.router = props.router;
        return _this;
    }

    _createClass(RouterProvider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return { router: this.router };
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.router !== nextProps.router) {
                console.error('[react-router5][RouterProvider] does not support changing the router object.');
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var children = this.props.children;

            return _react.Children.only(children);
        }
    }]);

    return RouterProvider;
}(_react.Component);

RouterProvider.propTypes = {
    router: _propTypes2.default.object.isRequired,
    children: _propTypes2.default.element.isRequired
};

RouterProvider.childContextTypes = {
    router: _propTypes2.default.object.isRequired
};

exports.default = RouterProvider;