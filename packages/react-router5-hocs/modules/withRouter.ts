import { Component, createElement, ComponentClass, ComponentType } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'router5'

function withRouter<P>(
    BaseComponent: ComponentType<P & { router: Router }>
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

    // WORKAROUND: compatibility with older versions of react
    ;(WithRouter as any).contextTypes = {
        router: PropTypes.object.isRequired
    }

    return WithRouter
}

export default withRouter
