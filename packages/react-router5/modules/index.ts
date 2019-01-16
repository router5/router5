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
import { routerContext, routeContext } from './context'

const ConnectedLink = withRoute(BaseLink)
const Link = withRouter(BaseLink)

const Router = routerContext.Consumer
const Route = routeContext.Consumer

export {
    RouterProvider,
    BaseLink,
    ConnectedLink,
    Link,
    // HoC
    withRouter,
    withRoute,
    routeNode,
    // Render props
    Router,
    Route,
    RouteNode,
    // Hooks
    useRouter,
    useRoute,
    useRouteNode
}
