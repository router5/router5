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
    routes?: Route[] | RouteNode,
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
export declare type Dependencies = Record<string, any>
export interface Config {
    decoders: Record<string, any>
    encoders: Record<string, any>
    defaultParams: Record<string, any>
    forwardMap: Record<string, any>
}
export interface Router {
    config: Config
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
    getOptions(): Options
    setOption(option: string, value: any): Router
    makeState(
        name: string,
        params?: Params,
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
    isStarted(): boolean
    start(startPathOrState: string | State, done?: DoneFn): Router
    start(done?: DoneFn): Router
    stop(): void
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
    usePlugin(...plugins: PluginFactory[]): Unsubscribe
    addPlugin(plugin: Plugin): Router
    getPlugins(): PluginFactory[]
    useMiddleware(...middlewares: MiddlewareFactory[]): Router
    clearMiddleware(): Router
    getMiddlewareFactories: () => MiddlewareFactory[]
    getMiddlewareFunctions: () => Middleware[]
    setDependency(dependencyName: string, dependency: any): Router
    setDependencies(deps: Dependencies): Router
    getDependencies(): Dependencies
    getInjectables(): [Router, Dependencies]
    executeFactory(
        factory: (router?: Router, dependencies?: Dependencies) => any
    ): any
    invokeEventListeners: (eventName: any, ...args: any[]) => void
    removeEventListener: (eventName: any, cb: any) => void
    addEventListener: (eventName: any, cb: any) => Unsubscribe
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
    subscribe(listener: SubscribeFn | Listener): Unsubscribe | Subscription
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
    teardown?(): void
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
    (router?: Router, dependencies?: Dependencies): Plugin
}
export interface SubscribeState {
    route: State
    previousRoute: State
}
export declare type SubscribeFn = (state: SubscribeState) => void
export interface Listener {
    next: (val: any) => {}
    [key: string]: any
}
export interface Subscription {
    unsubscribe: Unsubscribe
}
