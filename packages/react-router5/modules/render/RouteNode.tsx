import React, { ReactNode, ReactElement } from 'react'
import { shouldUpdateNode } from 'router5-transition-path'
import { RouteContext } from '../types'
import { routeContext } from '../context'

export interface RouteNodeProps {
    nodeName: string
    children: (routeContext: RouteContext) => ReactNode
}

class RouteNode extends React.Component<RouteNodeProps> {
    private memoizedResult: ReactNode

    constructor(props, context) {
        super(props, context)

        this.renderOnRouteNodeChange = this.renderOnRouteNodeChange.bind(this)
    }

    renderOnRouteNodeChange(routeContext) {
        const shouldUpdate = shouldUpdateNode(this.props.nodeName)(
            routeContext.route,
            routeContext.previousRoute
        )

        if (!this.memoizedResult || shouldUpdate) {
            this.memoizedResult = this.props.children(routeContext)
        }

        return this.memoizedResult
    }

    render() {
        return (
            <routeContext.Consumer>
                {this.renderOnRouteNodeChange}
            </routeContext.Consumer>
        )
    }
}

export default RouteNode
