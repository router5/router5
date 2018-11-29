import RouteNode from 'route-node'
import { Router, Route } from '../types/router'
export default function withRoutes(
    routes: Route[] | RouteNode
): (router: Router) => Router
