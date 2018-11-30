import React, { ReactNode } from 'react'
import { UnsubscribeFn, RouterState } from './types'
import { Router } from 'router5'
import { routerContext, routeContext } from './context'

export interface RouteProviderProps {
    router: Router
    children: ReactNode
}

class RouterProvider extends React.PureComponent<RouteProviderProps> {
    private mounted: boolean
    private routeState: RouterState
    private unsubscribe: UnsubscribeFn

    constructor(props) {
        super(props)
        this.mounted = false
        this.routeState = {
            route: props.router.getState(),
            previousRoute: null
        }

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
            this.unsubscribe = this.props.router.subscribe(
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
        return (
            <routerContext.Provider value={this.props.router}>
                <routeContext.Provider
                    value={{ router: this.props.router, ...this.routeState }}
                >
                    {this.props.children}
                </routeContext.Provider>
            </routerContext.Provider>
        )
    }
}

export default RouterProvider
