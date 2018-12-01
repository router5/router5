import React, { ReactNode, ReactElement, SFC } from 'react'
import { shouldUpdateNode } from 'router5-transition-path'
import { RouteContext } from '../types'
import { routeContext } from '../context'

export interface RouteNodeProps {
    nodeName: string
    children: (routeContext: RouteContext) => ReactNode
}

class RouteNodeRenderer extends React.Component<RouteNodeProps & RouteContext> {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return shouldUpdateNode(this.props.nodeName)(
            nextProps.route,
            nextProps.previousRoute
        )
    }

    render() {
        const { router, route, previousRoute } = this.props

        return this.props.children({ router, route, previousRoute })
    }
}

const RouteNode: SFC<RouteNodeProps> = props => {
    return (
        <routeContext.Consumer>
            {routeContext => <RouteNodeRenderer {...props} {...routeContext} />}
        </routeContext.Consumer>
    )
}

export default RouteNode
