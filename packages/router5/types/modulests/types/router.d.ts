import RouteNode, {
    TrailingSlashMode,
    QueryParamsMode,
    QueryParamsOptions,
    RouteNodeState
} from 'route-node'
import {
    State,
    SimpleState,
    Params,
    DoneFn,
    NavigationOptions,
    Unsubscribe,
    CancelFn
} from './base'
export declare type CreateRouter = (
    routes: Route[] | RouteNode,
    options?: Partial<Options>,
    dependencies?: Dependencies
) => Router
export interface Route {
    name: string
    path: string
    canActivate?: ActivationFnFactory
    forwardTo?: string
    children?: Route[]
    encodeParams?(stateParams: Params): Params
    decodeParams?(pathParams: Params): Params
    defaultParams?: Params
}
export interface Options {
    defaultRoute?: string
    defaultParams?: Params
    strictTrailingSlash: boolean
    trailingSlashMode: TrailingSlashMode
    queryParamsMode: QueryParamsMode
    autoCleanUp: boolean
    allowNotFound: boolean
    strongMatching: boolean
    rewritePathOnMatch: boolean
    queryParams?: QueryParamsOptions
    caseSensitive: boolean
}
export declare type ActivationFn = (
    toState: State,
    fromState: State,
    done: DoneFn
) => boolean | Promise<boolean> | void
export declare type ActivationFnFactory = (
    router: Router,
    dependencies?: Dependencies
) => ActivationFn
export interface Dependencies {
    [key: string]: any
}
export interface BaseRouter {
    config: any
}
export interface RouterWithCloning {
    clone(dependencies: Dependencies): Router
}
export interface RouterWithRoutes {
    rootNode: RouteNode
    add(routes: Route[] | Route, finalSort?: boolean): Router
    addNode(
        name: string,
        path: string,
        canActivateHandler?: ActivationFnFactory
    ): Router
    isActive(
        name: string,
        params?: Params,
        strictEquality?: boolean,
        ignoreQueryParams?: boolean
    ): boolean
    buildPath(route: string, params?: Params): string
    matchPath(path: string, source?: string): State | null
    setRootPath(rootPath: string): void
}
export interface RouterWithOptions {
    getOptions(): Options
    setOption(option: string, value: any): Router
}
export interface RouterWithState {
    makeState(
        name: string,
        params: Params,
        path?: string,
        meta?: any,
        forceId?: number
    ): State
    makeNotFoundState(path: string, options?: NavigationOptions): State
    getState(): State
    setState(state: State): void
    areStatesEqual(
        state1: State,
        state2: State,
        ignoreQueryParams?: boolean
    ): boolean
    areStatesDescendants(parentState: State, childState: State): boolean
    forwardState(routeName: string, routeParams: Params): SimpleState
    buildState(routeName: string, routeParams: Params): RouteNodeState | null
}
export interface RouterWithLifecycle {
    isStarted(): boolean
    start(startPathOrState: string | State, done?: DoneFn): Router
    start(done?: DoneFn): Router
    stop(): void
}
export interface RouterWithRouteLifecycle {
    canDeactivate(
        name: string,
        canDeactivateHandler: ActivationFnFactory | boolean
    ): Router
    clearCanDeactivate(name: string): Router
    canActivate(
        name: string,
        canActivateHandler: ActivationFnFactory | boolean
    ): Router
    getLifecycleFactories(): [
        {
            [key: string]: ActivationFnFactory
        },
        {
            [key: string]: ActivationFnFactory
        }
    ]
    getLifecycleFunctions(): [
        {
            [key: string]: ActivationFn
        },
        {
            [key: string]: ActivationFn
        }
    ]
}
export interface RouterWithPlugins {
    usePlugin(...plugins: PluginFactory[]): Router
    hasPlugin(pluginName: string): boolean
    addPlugin(plugin: Plugin): Router
    getPlugins(): PluginFactory[]
}
export interface RouterWithMiddleware {
    useMiddleware(...middlewares: MiddlewareFactory[]): Router
    clearMiddleware(): Router
    getMiddlewareFactories: () => MiddlewareFactory[]
    getMiddlewareFunctions: () => Middleware[]
}
export interface RouterWithDependencies {
    setDependency(dependencyName: string, dependency: any): Router
    setDependencies(deps: Dependencies): Router
    getDependencies(): Dependencies
    getInjectables(): [Router, Dependencies]
    executeFactory(
        factory: (router?: Router, dependencies?: Dependencies) => any
    ): any
}
export interface RouterWithEvents {
    invokeEventListeners: (eventName: any, ...args: any[]) => void
    removeEventListener: (eventName: any, cb: any) => void
    addEventListener: (eventName: any, cb: any) => Unsubscribe
}
export interface RouterWithNavigation {
    cancel(): Router
    forward(fromRoute: string, toRoute: string): Router
    navigate(
        routeName: string,
        routeParams: Params,
        options: NavigationOptions,
        done?: DoneFn
    ): CancelFn
    navigate(routeName: string, routeParams: Params, done?: DoneFn): CancelFn
    navigate(routeName: string, done?: DoneFn): CancelFn
    navigateToDefault(opts: NavigationOptions, done?: DoneFn): CancelFn
    navigateToDefault(done?: DoneFn): CancelFn
    transitionToState(
        toState: State,
        fromState: State,
        opts: NavigationOptions,
        done: DoneFn
    ): any
}
export interface RouterWithObservable {
    subscribe(listener: SubscribeFn | Listener): UnsubscribeFn | Subscription
}
export declare type Router = BaseRouter &
    RouterWithRoutes &
    RouterWithOptions &
    RouterWithDependencies &
    RouterWithEvents &
    RouterWithCloning &
    RouterWithPlugins &
    RouterWithMiddleware &
    RouterWithState &
    RouterWithLifecycle &
    RouterWithRouteLifecycle &
    RouterWithNavigation &
    RouterWithObservable
export interface InternalRouter {
    setState(state: State): void
}
export interface Plugin {
    onStart?(): void
    onStop?(): void
    onTransitionStart?(toState?: State, fromState?: State): void
    onTransitionCancel?(toState?: State, fromState?: State): void
    onTransitionError?(toState?: State, fromState?: State, err?: any): void
    onTransitionSuccess?(
        toState?: State,
        fromState?: State,
        opts?: NavigationOptions
    ): void
}
export declare type Middleware = (
    toState: State,
    fromState: State,
    done: DoneFn
) => boolean | Promise<any> | void
export declare type MiddlewareFactory = (
    router: Router,
    dependencies: Dependencies
) => Middleware
export interface PluginFactory {
    pluginName: string
    (router: Router, dependencies?: Dependencies): Plugin
}
export interface SubscribeState {
    route: State
    previousRoute: State
}
export declare type SubscribeFn = (state: SubscribeState) => void
export declare type UnsubscribeFn = () => void
export interface Listener {
    next: (val: any) => {}
    [key: string]: any
}
export interface Subscription {
    unsubscribe: UnsubscribeFn
}
