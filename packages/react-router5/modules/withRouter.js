import { Component, createElement } from 'react'
import { getDisplayName } from './utils'
import PropTypes from 'prop-types'

function withRouter(BaseComponent) {
    class ComponentWithRouter extends Component {
        constructor(props, context) {
            super(props, context)
            this.router = context.router
        }

        render() {
            return createElement(BaseComponent, {
                ...this.props,
                router: this.router
            })
        }
    }

    ComponentWithRouter.contextTypes = {
        router: PropTypes.object.isRequired
    }

    ComponentWithRouter.displayerName =
        'WithRouter[' + getDisplayName(BaseComponent) + ']'

    return ComponentWithRouter
}

export default withRouter
