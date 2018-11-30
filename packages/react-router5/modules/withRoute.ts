import { Component, createElement, ComponentClass } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'router5'
import { RouterState, UnsubscribeFn } from './types'

function withRoute<P>(
    BaseComponent: React.ComponentType<P & RouterState>
): ComponentClass<P> {
    class WithRoute extends Component<P> {
        private router: Router
        private routeState: RouterState
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
                    this.routeState = {
                        route,
                        previousRoute
                    }
                    if (this.mounted) {
                        this.forceUpdate()
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
            return createElement(BaseComponent, {
                //@ts-ignore
                ...this.props,
                ...this.routeState,
                router: this.router
            })
        }
    }

    WithRoute.contextTypes = {
        router: PropTypes.object.isRequired
    }

    return WithRoute
}

export default withRoute
