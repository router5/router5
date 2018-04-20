import { Component, createElement } from 'react'
import { getDisplayName } from './utils'
import PropTypes from 'prop-types'

function withRoute(BaseComponent) {
    class ComponentWithRoute extends Component {
        constructor(props, context) {
            super(props, context)
            this.router = context.router
            this.state = {
                previousRoute: null,
                route: this.router.getState()
            }
        }

        componentDidMount() {
            const listener = ({ route, previousRoute }) => {
                this.setState({ route, previousRoute })
            }
            this.unsubscribe = this.router.subscribe(listener)
        }

        componentWillUnmount() {
            this.unsubscribe()
        }

        render() {
            return createElement(BaseComponent, {
                ...this.props,
                ...this.state,
                router: this.router
            })
        }
    }

    ComponentWithRoute.contextTypes = {
        router: PropTypes.object.isRequired
    }

    ComponentWithRoute.displayName =
        'WithRoute[' + getDisplayName(BaseComponent) + ']'

    return ComponentWithRoute
}

export default withRoute
