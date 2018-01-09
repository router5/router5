declare module 'router5-helpers' {
    import { ActivationFnFactory, Params, State } from 'router5'

    export type ApplySegmentFn = (segment: string) => boolean
    export type RedirectToFn = (
        toRouteName: string,
        toRouteParams?: Params | ToRouteParamsFn
    ) => ActivationFnFactory
    export type ToRouteParamsFn = (params: Params) => Params

    export function redirect(
        fromRouteName: string,
        toRouteName: string,
        toRouteParams?: Params | ToRouteParamsFn
    ): ActivationFnFactory
    export function redirect(fromRouteName: string): RedirectToFn

    export function startsWithSegment(
        route: string | State,
        segment: string
    ): boolean
    export function startsWithSegment(route: string | State): ApplySegmentFn

    export function endsWithSegment(
        route: string | State,
        segment: string
    ): boolean
    export function endsWithSegment(route: string | State): ApplySegmentFn

    export function includesSegment(
        route: string | State,
        segment: string
    ): boolean
    export function includesSegment(route: string | State): ApplySegmentFn
}
