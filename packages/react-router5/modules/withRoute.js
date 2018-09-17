import { Component, createElement } from 'react'
import { getDisplayName } from './utils'
import PropTypes from 'prop-types'

function withRoute(BaseComponent) {
    class ComponentWithRoute extends Component {
        constructor(props, context) {
            super(props, context)
            this.router = context.router
            this.routeState = {
                previousRoute: null,
                route: this.router.getState()
            }
            this.mounted = false

            if (typeof window !== 'undefined') {
                const listener = ({ route, previousRoute }) => {
                    this.routeState = {
                        route,
                        previousRoute
                    }
                    if (this.mounted) {
                        this.forceUpdate()
                    }
                }
                this.unsubscribe = this.router.subscribe(listener)
            }
        }

        componentDidMount() {
            this.mounted = true
        }

        componentWillUnmount() {
            if (this.unsubscribe) {
                this.unsubscribe()
            }
        }

        render() {
            return createElement(BaseComponent, {
                ...this.props,
                ...this.routeState,
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
