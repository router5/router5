/// <reference types="react" />
import RouterProvider from './RouterProvider'
export { routerContext, routeContext } from './context'
import BaseLink from './BaseLink'
import withRouter from './hocs/withRouter'
import withRoute from './hocs/withRoute'
import routeNode from './hocs/routeNode'
import RouteNode from './render/RouteNode'
import useRouter from './hooks/useRouter'
import useRoute from './hooks/useRoute'
import useRouteNode from './hooks/useRouteNode'
declare const ConnectedLink: import('react').SFC<any>
declare const Link: import('react').SFC<any>
declare const Router: import('react').Consumer<import('router5').Router>
declare const Route: import('react').Consumer<import('./types').RouteContext>
export {
    RouterProvider,
    BaseLink,
    ConnectedLink,
    Link,
    withRouter,
    withRoute,
    routeNode,
    Router,
    Route,
    RouteNode,
    useRouter,
    useRoute,
    useRouteNode
}
