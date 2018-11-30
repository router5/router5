import React, { ReactNode } from 'react'
import { Router } from 'router5'
import { RouterContext } from './types'
declare const Route: any
export interface RouteProviderProps {
    router: Router
    children: ReactNode
}
declare class RouteProvider extends React.PureComponent<RouteProviderProps> {
    private mounted
    private router
    private routeState
    private unsubscribe
    constructor(props: any)
    componentDidMount(): void
    componentWillUnmount(): void
    getChildContext(): {
        router: Router
    }
    render(): JSX.Element
}
export interface RouteNodeProps {
    nodeName: string
    children: (routeContext: RouterContext) => ReactNode
}
declare class RouteNode extends React.Component<RouteNodeProps> {
    private memoizedResult
    constructor(props: any, context: any)
    renderOnRouteNodeChange(routeContext: any): React.ReactNode
    render(): JSX.Element
}
export { RouteProvider, Route, RouteNode }
