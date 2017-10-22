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

    export function withRoute<
        TProps extends Partial<{
            route: State;
            previousRoute: State;
        }>,
            TComponent extends (ComponentClass<TProps> | StatelessComponent<TProps>)
        >(
            BaseComponent: TComponent
        ): ComponentClass<TProps>;

    export function routerNode<
        TProps extends {
            router?: Router,
            previousRoute?: State,
            route?: State,
        },
            TComponent extends (ComponentClass<TProps> | StatelessComponent<TProps>)
        >(
            nodeName: string
        ): (
            RouteSegment: TComponent
        ) => ComponentClass<TProps>;
}
