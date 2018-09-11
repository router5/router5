import React, { Component } from 'react'
import PropTypes from 'prop-types'

class BaseLink extends Component {
    constructor(props, context) {
        super(props, context)

        this.router = context.router

        if (!this.router.hasPlugin('BROWSER_PLUGIN')) {
            console.error(
                '[react-router5][BaseLink] missing browser plugin, href might be built incorrectly'
            )
        }

        this.isActive = this.isActive.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
        this.callback = this.callback.bind(this)

        this.state = { active: this.isActive() }
    }

    buildUrl(routeName, routeParams) {
        if (this.router.buildUrl) {
            return this.router.buildUrl(routeName, routeParams)
        }

        return this.router.buildPath(routeName, routeParams)
    }

    isActive() {
        return this.router.isActive(
            this.props.routeName,
            this.props.routeParams,
            this.props.activeStrict,
            this.props.ignoreQueryParams
        )
    }

    callback(err, state) {
        if (!err && this.props.successCallback) {
            this.props.successCallback(state)
        }

        if (err && this.props.errorCallback) {
            this.props.errorCallback(err)
        }
    }

    clickHandler(evt) {
        const { onClick, target } = this.props

        if (onClick) {
            onClick(evt)

            if (evt.defaultPrevented) {
                return
            }
        }

        const comboKey =
            evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey

        if (evt.button === 0 && !comboKey && target !== '_blank') {
            evt.preventDefault()
            this.router.navigate(
                this.props.routeName,
                this.props.routeParams,
                this.props.routeOptions,
                this.callback
            )
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
            ignoreQueryParams,
            route,
            previousRoute,
            router,
            children,
            onClick,
            successCallback,
            errorCallback,
            ...linkProps
        } = this.props
        /* eslint-enable */

        const active = this.isActive()
        const href = this.buildUrl(routeName, routeParams)
        const linkclassName = (active ? [activeClassName] : [])
            .concat(className ? className.split(' ') : [])
            .join(' ')

        return React.createElement(
            'a',
            {
                ...linkProps,
                href,
                className: linkclassName,
                onClick: this.clickHandler
            },
            children
        )
    }
}

BaseLink.contextTypes = {
    router: PropTypes.object.isRequired
}

BaseLink.propTypes = {
    routeName: PropTypes.string.isRequired,
    routeParams: PropTypes.object,
    routeOptions: PropTypes.object,
    activeClassName: PropTypes.string,
    activeStrict: PropTypes.bool,
    ignoreQueryParams: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    successCallback: PropTypes.func,
    errorCallback: PropTypes.func
}

BaseLink.defaultProps = {
    activeClassName: 'active',
    activeStrict: false,
    ignoreQueryParams: true,
    routeParams: {},
    routeOptions: {}
}

export default BaseLink
