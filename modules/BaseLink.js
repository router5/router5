import React, { Component, PropTypes } from 'react';

class BaseLink extends Component {
    constructor(props, context) {
        super(props, context);

        this.router = context.router;

        if (!this.router.hasPlugin('browserPlugin')) {
            console.warning('[react-router5][BaseLink] missing plugin router5-plugin-browser, cannot build href');
        };

        this.isActive = this.isActive.bind(this);
        this.clickHandler = this.clickHandler.bind(this);

        this.state = { active: this.isActive() };
    }

    buildUrl(routeName, routeParams) {
        if (this.router.buildUrl) {
            return this.router.buildUrl(routeName, routeParams);
        }

        return '';
    }

    isActive() {
        return this.router.isActive(this.props.routeName, this.props.routeParams, this.props.activeStrict);
    }

    clickHandler(evt) {
        if (this.props.onClick) {
            this.props.onClick(evt);

            if (evt.defaultPrevented) {
                return;
            }
        }

        const comboKey = evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;

        if (evt.button === 0 && !comboKey) {
            evt.preventDefault();
            this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
        }
    }

    render() {
        const { routeName, routeParams, className, activeClassName, children } = this.props;

        const active = this.isActive();
        const href =  this.buildUrl(routeName, routeParams);
        const linkclassName = (className ? className.split(' ') : [])
            .concat(active ? [activeClassName] : []).join(' ');

        const onClick = this.clickHandler;

        return React.createElement('a', {href, className: linkclassName, onClick}, children);
    }
}

BaseLink.contextTypes = {
    router: PropTypes.object.isRequired
};

BaseLink.propTypes = {
    routeName:       PropTypes.string.isRequired,
    routeParams:     PropTypes.object,
    routeOptions:    PropTypes.object,
    activeClassName: PropTypes.string,
    activeStrict:    PropTypes.bool,
    onClick:         PropTypes.func
};

BaseLink.defaultProps = {
    activeClassName: 'active',
    activeStrict:    false,
    routeParams:     {},
    routeOptions:    {}
};

export default BaseLink;
