import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BaseLink extends Component {
    constructor(props, context) {
        super(props, context);

        this.router = context.router;

        if (!this.router.hasPlugin('BROWSER_PLUGIN')) {
            console.error(
                '[react-router5][BaseLink] missing browser plugin, href might be build incorrectly'
            );
        }

        this.isActive = this.isActive.bind(this);
        this.clickHandler = this.clickHandler.bind(this);

        this.state = { active: this.isActive() };
    }

    buildUrl(routeName, routeParams) {
        if (this.router.buildUrl) {
            return this.router.buildUrl(routeName, routeParams);
        }

        return this.router.buildPath(routeName, routeParams);
    }

    isActive() {
        return this.router.isActive(
            this.props.routeName,
            this.props.routeParams,
            this.props.activeStrict
        );
    }

    clickHandler(evt) {
        if (this.props.onClick) {
            this.props.onClick(evt);

            if (evt.defaultPrevented) {
                return;
            }
        }

        const comboKey =
            evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;

        if (evt.button === 0 && !comboKey) {
            evt.preventDefault();
            this.router.navigate(
                this.props.routeName,
                this.props.routeParams,
                this.props.routeOptions
            );
        }
    }

    render() {
        /* eslint-disable */
        const {
            routeName,
            routeParams,
            routeOptions,
            className,
            activeClassName,
            activeStrict,
            route,
            previousRoute,
            router,
            children,
            onClick,
            ...linkProps
        } = this.props;
        /* eslint-enable */

        const active = this.isActive();
        const href = this.buildUrl(routeName, routeParams);
        const linkclassName = (className ? className.split(' ') : [])
            .concat(active ? [activeClassName] : [])
            .join(' ');

        return React.createElement(
            'a',
            {
                ...linkProps,
                href,
                className: linkclassName,
                onClick: this.clickHandler
            },
            children
        );
    }
}

BaseLink.contextTypes = {
    router: PropTypes.object.isRequired
};

BaseLink.propTypes = {
    routeName: PropTypes.string.isRequired,
    routeParams: PropTypes.object,
    routeOptions: PropTypes.object,
    activeClassName: PropTypes.string,
    activeStrict: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func
};

BaseLink.defaultProps = {
    activeClassName: 'active',
    activeStrict: false,
    routeParams: {},
    routeOptions: {}
};

export default BaseLink;
