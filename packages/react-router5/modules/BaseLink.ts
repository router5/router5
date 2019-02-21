import { NavigationOptions, State, Router } from 'router5'
import React, { Component, HTMLAttributes, MouseEventHandler } from 'react'

export interface BaseLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    routeName: string
    routeParams?: { [key: string]: any }
    routeOptions?: NavigationOptions
    className?: string
    activeClassName?: string
    activeStrict?: boolean
    ignoreQueryParams?: boolean
    onClick?: MouseEventHandler<HTMLAnchorElement>
    onMouseOver?: MouseEventHandler<HTMLAnchorElement>
    successCallback?(state?: State): void
    errorCallback?(error?: any): void
    target?: string
    route?: State
    previousRoute?: State
    router: Router
}

export interface BaseLinkState {
    active: boolean
}

class BaseLink extends Component<BaseLinkProps, BaseLinkState> {
    public router: Router

    constructor(props, context) {
        super(props, context)

        this.router = this.props.router
        this.isActive = this.isActive.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
        this.callback = this.callback.bind(this)

        this.state = { active: this.isActive() }
    }

    buildUrl(routeName, routeParams) {
        //@ts-ignore
        if (this.router.buildUrl) {
            //@ts-ignore
            return this.router.buildUrl(routeName, routeParams)
        }

        return this.router.buildPath(routeName, routeParams)
    }

    isActive() {
        const {
            routeName,
            routeParams = {},
            activeStrict = false,
            ignoreQueryParams = true
        } = this.props

        return this.router.isActive(
            routeName,
            routeParams,
            activeStrict,
            ignoreQueryParams
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
                this.props.routeParams || {},
                this.props.routeOptions || {},
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
            activeClassName = 'active',
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

export default BaseLink
