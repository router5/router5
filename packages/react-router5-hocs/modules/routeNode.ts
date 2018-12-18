import { Component, createElement, ComponentClass } from 'react'
import PropTypes from 'prop-types'
import { shouldUpdateNode } from 'router5-transition-path'
import { RouterState, RouteState, UnsubscribeFn } from './types'
import { Router } from 'router5'

function routeNode<P>(nodeName: string) {
    return function routeNodeWrapper(
        RouteSegment: React.ComponentType<P & RouterState>
    ): ComponentClass<P> {
        class RouteNode extends Component<P> {
            private router: Router
            private routeState: RouteState
            private mounted: boolean
            private unsubscribe: UnsubscribeFn

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
                        if (shouldUpdateNode(nodeName)(route, previousRoute)) {
                            this.routeState = {
                                previousRoute,
                                route
                            }
                            if (this.mounted) {
                                this.forceUpdate()
                            }
                        }
                    }
                    this.unsubscribe = this.router.subscribe(
                        listener
                    ) as UnsubscribeFn
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
                const { props, router } = this
                const { previousRoute, route } = this.routeState
                const component = createElement(RouteSegment, {
                    //@ts-ignore
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

        return RouteNode
    }
}

export default routeNode
