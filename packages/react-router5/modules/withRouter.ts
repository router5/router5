import { Component, createElement, ComponentClass } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'router5'

function withRouter<P>(
    BaseComponent: ComponentClass<P, { router: Router }>
): ComponentClass<P> {
    class WithRouter extends Component<P> {
        private router: Router

        constructor(props, context) {
            super(props, context)
            this.router = context.router
        }

        render() {
            return createElement(BaseComponent, {
                //@ts-ignore
                ...this.props,
                router: this.router
            })
        }
    }

    WithRouter.contextTypes = {
        router: PropTypes.object.isRequired
    }

    return WithRouter
}

export default withRouter
