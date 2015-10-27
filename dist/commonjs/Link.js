'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Link = (function (_Component) {
    _inherits(Link, _Component);

    function Link(props, context) {
        _classCallCheck(this, Link);

        _get(Object.getPrototypeOf(Link.prototype), 'constructor', this).call(this, props, context);
        this.router = context.router;

        this.isActive = this.isActive.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.routeChangeHandler = this.routeChangeHandler.bind(this);

        this.state = { active: this.isActive() };
    }

    _createClass(Link, [{
        key: 'isActive',
        value: function isActive() {
            return this.router.isActive(this.props.routeName, this.props.routeParams);
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
                this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
            }
        }
    }, {
        key: 'routeChangeHandler',
        value: function routeChangeHandler(toState, fromState) {
            this.setState({ active: this.isActive() });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.router.addListener(this.routeChangeHandler);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.router.removeListener(this.routeChangeHandler);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var routeName = _props.routeName;
            var routeParams = _props.routeParams;
            var className = _props.className;
            var activeClassName = _props.activeClassName;
            var children = _props.children;
            var active = this.state.active;

            var href = this.router.buildUrl(routeName, routeParams);
            var linkclassName = (className ? className.split(' ') : []).concat(active ? [activeClassName] : []).join(' ');

            var onClick = this.clickHandler;

            return _react2['default'].createElement('a', { href: href, className: linkclassName, onClick: onClick }, children);
        }
    }]);

    return Link;
})(_react.Component);

Link.contextTypes = {
    router: _react.PropTypes.object.isRequired
};

Link.propTypes = {
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

exports['default'] = Link;
module.exports = exports['default'];