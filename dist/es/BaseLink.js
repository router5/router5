import React, { Component } from 'react';
import PropTypes from 'prop-types';

var BaseLink = function (_Component) {
    babelHelpers.inherits(BaseLink, _Component);

    function BaseLink(props, context) {
        babelHelpers.classCallCheck(this, BaseLink);

        var _this = babelHelpers.possibleConstructorReturn(this, (BaseLink.__proto__ || Object.getPrototypeOf(BaseLink)).call(this, props, context));

        _this.router = context.router;

        if (!_this.router.hasPlugin('BROWSER_PLUGIN')) {
            console.error('[react-router5][BaseLink] missing browser plugin, href might be build incorrectly');
        };

        _this.isActive = _this.isActive.bind(_this);
        _this.clickHandler = _this.clickHandler.bind(_this);

        _this.state = { active: _this.isActive() };
        return _this;
    }

    babelHelpers.createClass(BaseLink, [{
        key: 'buildUrl',
        value: function buildUrl(routeName, routeParams) {
            if (this.router.buildUrl) {
                return this.router.buildUrl(routeName, routeParams);
            }

            return this.router.buildPath(routeName, routeParams);
        }
    }, {
        key: 'isActive',
        value: function isActive() {
            return this.router.isActive(this.props.routeName, this.props.routeParams, this.props.activeStrict);
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

            var comboKey = evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;

            if (evt.button === 0 && !comboKey) {
                evt.preventDefault();
                this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                routeName = _props.routeName,
                routeParams = _props.routeParams,
                className = _props.className,
                activeClassName = _props.activeClassName,
                children = _props.children;


            var active = this.isActive();
            var href = this.buildUrl(routeName, routeParams);
            var linkclassName = (className ? className.split(' ') : []).concat(active ? [activeClassName] : []).join(' ');

            var onClick = this.clickHandler;

            return React.createElement('a', { href: href, className: linkclassName, onClick: onClick }, children);
        }
    }]);
    return BaseLink;
}(Component);

BaseLink.contextTypes = {
    router: PropTypes.object.isRequired
};

BaseLink.propTypes = {
    routeName: PropTypes.string.isRequired,
    routeParams: PropTypes.object,
    routeOptions: PropTypes.object,
    activeClassName: PropTypes.string,
    activeStrict: PropTypes.bool,
    onClick: PropTypes.func
};

BaseLink.defaultProps = {
    activeClassName: 'active',
    activeStrict: false,
    routeParams: {},
    routeOptions: {}
};

export default BaseLink;