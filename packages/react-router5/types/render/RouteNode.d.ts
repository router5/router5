import { ReactNode, SFC } from 'react'
import { RouteContext } from '../types'
export interface RouteNodeProps {
    nodeName: string
    children: (routeContext: RouteContext) => ReactNode
}
declare const RouteNode: SFC<RouteNodeProps>
export default RouteNode
