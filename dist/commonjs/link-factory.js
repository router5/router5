'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

exports['default'] = linkFactory;

function linkFactory(router) {
    return _react2['default'].createClass({
        propTypes: {
            routeName: _react2['default'].PropTypes.string.isRequired,
            routeParams: _react2['default'].PropTypes.object,
            routeOptions: _react2['default'].PropTypes.object,
            activeClassName: _react2['default'].PropTypes.string,
            activeStrict: _react2['default'].PropTypes.bool,
            onClick: _react2['default'].PropTypes.func
        },

        getDefaultProps: function getDefaultProps() {
            return {
                activeClassName: 'active',
                activeStrict: false,
                routeParams: {},
                routeOptions: {}
            };
        },

        getInitialState: function getInitialState() {
            // Initialise state
            // Not an anti-pattern
            // https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
            return {
                active: router.isActive(this.props.routeName, this.props.routeParams, this.props.activeStrict)
            };
        },

        clickHandler: function clickHandler(evt) {
            if (this.props.onClick) {
                this.props.onClick(evt);

                if (evt.defaultPrevented) {
                    return;
                }
            }

            var comboKey = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

            if (evt.button === 0 && !comboKey) {
                evt.preventDefault();
                router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
            }
        },

        // Is it overkill?
        // Should it be an option to observe state in Links?
        // Should we add a GroupLink component for menus?
        routeChangeHandler: function routeChangeHandler(toState, fromState) {
            this.setState({ active: router.isActive(this.props.routeName, this.props.routeParams) });
        },

        componentDidMount: function componentDidMount() {
            router.addListener(this.routeChangeHandler);
        },

        componentWillUnmount: function componentWillUnmount() {
            router.removeListener(this.routeChangeHandler);
        },

        render: function render() {
            var props = this.props;
            var active = this.state.active;

            var href = router.buildUrl(props.routeName, props.routeParams);
            var className = (props.className ? props.className.split(' ') : []).concat(active ? [props.activeClassName] : []).join(' ');
            var onClick = this.clickHandler;

            return _react2['default'].createElement('a', { href: href, className: className, onClick: onClick }, props.children);
        }
    });
}
module.exports = exports['default'];