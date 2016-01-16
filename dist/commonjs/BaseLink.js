'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseLink = (function (_Component) {
    _inherits(BaseLink, _Component);

    function BaseLink(props, context) {
        _classCallCheck(this, BaseLink);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseLink).call(this, props, context));

        _this.isActive = _this.isActive.bind(_this);
        _this.clickHandler = _this.clickHandler.bind(_this);
        _this.routeChangeHandler = _this.routeChangeHandler.bind(_this);

        _this.state = { active: _this.isActive() };
        return _this;
    }

    _createClass(BaseLink, [{
        key: 'isActive',
        value: function isActive() {
            return this.props.router.isActive(this.props.routeName, this.props.routeParams);
        }
    }, {
        key: 'clickHandler',
        value: function clickHandler(evt) {
            if (this.props.onClick) {
                this.props.onClick(evt);

                if (evt.defaultPrevented) {
                    return;
                }
            }

            var comboKey = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

            if (evt.button === 0 && !comboKey) {
                evt.preventDefault();
                this.props.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var router = _props.router;
            var routeName = _props.routeName;
            var routeParams = _props.routeParams;
            var className = _props.className;
            var activeClassName = _props.activeClassName;
            var children = _props.children;

            var active = this.isActive();
            var href = router.buildUrl(routeName, routeParams);
            var linkclassName = (className ? className.split(' ') : []).concat(active ? [activeClassName] : []).join(' ');

            var onClick = this.clickHandler;

            return _react2.default.createElement('a', { href: href, className: linkclassName, onClick: onClick }, children);
        }
    }]);

    return BaseLink;
})(_react.Component);

Link.propTypes = {
    // route:           PropTypes.object.isRequired,
    router: _react.PropTypes.object.isRequired,
    routeName: _react.PropTypes.string.isRequired,
    routeParams: _react.PropTypes.object,
    routeOptions: _react.PropTypes.object,
    activeClassName: _react.PropTypes.string,
    activeStrict: _react.PropTypes.bool,
    onClick: _react.PropTypes.func
};

Link.defaultProps = {
    activeClassName: 'active',
    activeStrict: false,
    routeParams: {},
    routeOptions: {}
};

exports.default = BaseLink;