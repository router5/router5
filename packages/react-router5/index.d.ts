declare module 'react-router5' {
    import {
        ComponentClass,
        ComponentType,
        MouseEventHandler,
        HTMLAttributes
    } from 'react'
    import { Router, Route, State } from 'router5'

    type Diff<T extends string, U extends string> = ({ [P in T]: P } &
        { [P in U]: never } & { [x: string]: never })[T]

    type Omit<InputObject, Keys extends keyof InputObject> = Pick<
        InputObject,
        Diff<keyof InputObject, Keys>
    >

    export interface RouterProviderProps {
        router: Router
    }

    export const RouterProvider: ComponentClass<RouterProviderProps>

    export interface BaseLinkProps extends HTMLAttributes<HTMLAnchorElement> {
        routeName: string
        routeParams?: any
        routeOptions?: any
        activeClassName?: string
        activeStrict?: boolean
        onClick?: MouseEventHandler<HTMLAnchorElement>
        onMouseOver?: MouseEventHandler<HTMLAnchorElement>
    }

    export const BaseLink: ComponentClass<BaseLinkProps>

    export interface LinkProps extends BaseLinkProps {}

    export const Link: ComponentClass<LinkProps>

    export type InjectedRoute = {
        router: Router
        route: State | null
        previousRoute: State | null
    }

    export function withRoute<TProps extends Partial<InjectedRoute>>(
        BaseComponent: ComponentType<TProps>
    ): ComponentClass<Omit<TProps, keyof InjectedRoute>>

    export type InjectedRouterNode = {
        router: Router
        previousRoute: State | null
        route: State | null
    }

    export function routeNode<TProps extends Partial<InjectedRouterNode>>(
        nodeName: string
    ): (
        RouteSegment: ComponentType<TProps>
    ) => ComponentClass<Omit<TProps, keyof InjectedRouterNode>>
}
