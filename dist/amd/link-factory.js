define(['exports', 'module', 'react'], function (exports, module, _react) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _React = _interopRequireDefault(_react);

    module.exports = linkFactory;

    function linkFactory(router) {
        return _React['default'].createClass({
            propTypes: {
                routeName: _React['default'].PropTypes.string.isRequired,
                routeParams: _React['default'].PropTypes.object,
                routeOptions: _React['default'].PropTypes.object,
                activeClassName: _React['default'].PropTypes.string,
                activeStrict: _React['default'].PropTypes.bool,
                onClick: _React['default'].PropTypes.func
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

                return _React['default'].createElement('a', { href: href, className: className, onClick: onClick }, props.children);
            }
        });
    }
});