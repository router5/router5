import { ComponentClass } from 'react'
import { RouteState } from './types'
import { Router } from 'router5'
declare function routeNode<P>(
    nodeName: string
): (
    RouteSegment: import('react').ComponentType<
        P & {
            router: Router
        } & RouteState
    >
) => ComponentClass<P, any>
export default routeNode
