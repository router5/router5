/// <reference types="react" />
import RouterProvider from './RouterProvider'
export { routerContext, routeContext } from './context'
import withRouter from './hocs/withRouter'
import withRoute from './hocs/withRoute'
import routeNode from './hocs/routeNode'
import RouteNode from './render/RouteNode'
import useRouter from './hooks/useRouter'
import useRoute from './hooks/useRoute'
import useRouteNode from './hooks/useRouteNode'
declare const ConnectedLink: import('react').FunctionComponent<any>
declare const Link: import('react').FunctionComponent<any>
export {
    RouterProvider,
    ConnectedLink,
    Link,
    withRouter,
    withRoute,
    routeNode,
    RouteNode,
    useRouter,
    useRoute,
    useRouteNode
}
