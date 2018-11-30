import React, { SFC, ComponentType } from 'react'
import { RouteContext } from '../types'
import RouteNode from '../render/RouteNode'

function routeNode<P>(nodeName: string) {
    return function(BaseComponent: ComponentType<P & RouteContext>): SFC<P> {
        function RouteNode(props) {
            return (
                <RouteNode nodeName={nodeName}>
                    {routeContext => (
                        <BaseComponent {...props} {...routeContext} />
                    )}
                </RouteNode>
            )
        }

        return RouteNode
    }
}

export default routeNode
