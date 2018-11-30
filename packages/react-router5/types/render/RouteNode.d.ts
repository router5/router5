import React, { ReactNode } from 'react'
import { RouteContext } from '../types'
export interface RouteNodeProps {
    nodeName: string
    children: (routeContext: RouteContext) => ReactNode
}
declare class RouteNode extends React.Component<RouteNodeProps> {
    private memoizedResult
    constructor(props: any, context: any)
    renderOnRouteNodeChange(routeContext: any): React.ReactNode
    render(): JSX.Element
}
export default RouteNode
