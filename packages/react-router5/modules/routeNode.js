import { Component, createElement } from 'react'
import { getDisplayName } from './utils'
import PropTypes from 'prop-types'
import { shouldUpdateNode } from 'router5-transition-path'

function routeNode(nodeName) {
    return function routeNodeWrapper(RouteSegment) {
        class RouteNode extends Component {
            constructor(props, context) {
                super(props, context)
                this.router = context.router
                this.state = {
                    previousRoute: null,
                    route: this.router.getState()
                }

                if (typeof window !== 'undefined') {
                    const listener = ({ route, previousRoute }) => {
                        if (shouldUpdateNode(nodeName)(route, previousRoute)) {
                            this.setState({
                                previousRoute,
                                route
                            })
                        }
                    }
                    this.unsubscribe = this.router.subscribe(listener)
                }
            }

            componentWillUnmount() {
                if (this.unsubscribe) {
                    this.unsubscribe()
                }
            }

            render() {
                const { props, router } = this
                const { previousRoute, route } = this.state
                const component = createElement(RouteSegment, {
                    ...props,
                    router,
                    previousRoute,
                    route
                })

                return component
            }
        }

        RouteNode.contextTypes = {
            router: PropTypes.object.isRequired
        }

        RouteNode.displayName =
            'RouteNode[' + getDisplayName(RouteSegment) + ']'

        return RouteNode
    }
}

export default routeNode
