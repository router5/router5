import BaseLink from './BaseLink';
import routeNode from './routeNode';
import RouterProvider from './RouterProvider';
import withRoute from './withRoute';

var Link = withRoute(BaseLink);

export { BaseLink, routeNode, RouterProvider, withRoute, Link };