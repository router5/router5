import React, { ReactNode } from 'react'
import { Router } from 'router5'
export interface RouteProviderProps {
    router: Router
    children: ReactNode
}
declare class RouterProvider extends React.PureComponent<RouteProviderProps> {
    private mounted
    private routeState
    private unsubscribe
    constructor(props: any)
    componentDidMount(): void
    componentWillUnmount(): void
    render(): JSX.Element
}
export default RouterProvider
