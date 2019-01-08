import React from 'react'
declare function routeNode<P>(
    nodeName: string
): (
    BaseComponent: React.ComponentType<
        P & {
            router: import('router5').Router
        } & import('../types').RouteState
    >
) => React.FunctionComponent<P>
export default routeNode
