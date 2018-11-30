import { ComponentClass } from 'react'
import { RouterContext } from './types'
declare function routeNode<P>(
    nodeName: string
): (
    RouteSegment: import('react').ComponentType<P & RouterContext>
) => ComponentClass<P, any>
export default routeNode
