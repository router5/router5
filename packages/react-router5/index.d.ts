declare module "react-router5" {
    import { ComponentClass, MouseEventHandler, StatelessComponent, HTMLAttributes } from 'react';
    import { Router, Route, State } from 'router5';

    export interface RouterProviderProps {
        router: Router;
    }

    export const RouterProvider: ComponentClass<RouterProviderProps>;

    export interface BaseLinkProps extends HTMLAttributes<HTMLAnchorElement> {
        routeName: string;
        routeParams?: any;
        routeOptions?: any;
        activeClassName?: string;
        activeStrict?: boolean;
        onClick?: MouseEventHandler<HTMLAnchorElement>;
        onMouseOver?: MouseEventHandler<HTMLAnchorElement>;
    }

    export const BaseLink: ComponentClass<BaseLinkProps>;

    export interface LinkProps extends BaseLinkProps {
    }

    export const Link: ComponentClass<LinkProps>;

    export type InjectedRoute = Partial<{
        route: State;
        previousRoute: State;
    }>;

    export function withRoute<
        TProps extends InjectedRoute,
            TComponent extends (ComponentClass<TProps> | StatelessComponent<TProps>)
        >(
            BaseComponent: TComponent
        ): ComponentClass<TProps>;

    export type InjectedRouterNode = Partial<{
        router: Router,
        previousRoute: State,
        route: State,
    }>;

    export function routerNode<
        TProps extends InjectedRouterNode,
            TComponent extends (ComponentClass<TProps> | StatelessComponent<TProps>)
        >(
            nodeName: string
        ): (
            RouteSegment: TComponent
        ) => ComponentClass<TProps>;
}
