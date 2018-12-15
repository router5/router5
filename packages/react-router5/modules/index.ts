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

const ConnectedLink = withRoute(BaseLink)
const Link = withRouter(BaseLink)

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
