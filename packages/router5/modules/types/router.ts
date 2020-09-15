import {
    TrailingSlashMode,
    QueryParamsMode,
    QueryParamsOptions,
    RouteNode,
    RouteNodeState,
    URLParamsEncodingType
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

export interface Route<
    Dependencies extends DefaultDependencies = DefaultDependencies
> {
    name: string
    path: string
    canActivate?: ActivationFnFactory<Dependencies>
    forwardTo?: string
    children?: Array<Route<Dependencies>>
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
    urlParamsEncoding?: URLParamsEncodingType
}

export type ActivationFn = (
    toState: State,
    fromState: State,
    done: DoneFn
) => boolean | Promise<boolean> | void

export type ActivationFnFactory<
    Dependencies extends DefaultDependencies = DefaultDependencies
> = (router: Router, dependencies?: Dependencies) => ActivationFn

export type DefaultDependencies = Record<string, any>

export interface Config {
    decoders: Record<string, any>
    encoders: Record<string, any>
    defaultParams: Record<string, any>
    forwardMap: Record<string, any>
}

export interface Router<
    Dependencies extends DefaultDependencies = DefaultDependencies
> {
    config: Config

    rootNode: RouteNode
    add(
        routes: Array<Route<Dependencies>> | Route<Dependencies>,
        finalSort?: boolean
    ): Router<Dependencies>
    addNode(
        name: string,
        path: string,
        canActivateHandler?: ActivationFnFactory<Dependencies>
    ): Router<Dependencies>
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
    setOption(option: string, value: any): Router<Dependencies>

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
    start(startPathOrState: string | State, done?: DoneFn): Router<Dependencies>
    start(done?: DoneFn): Router<Dependencies>
    stop(): void

    canDeactivate(
        name: string,
        canDeactivateHandler: ActivationFnFactory<Dependencies> | boolean
    ): Router<Dependencies>
    clearCanDeactivate(name: string): Router
    canActivate(
        name: string,
        canActivateHandler: ActivationFnFactory<Dependencies> | boolean
    ): Router<Dependencies>
    getLifecycleFactories(): [
        { [key: string]: ActivationFnFactory<Dependencies> },
        { [key: string]: ActivationFnFactory<Dependencies> }
    ]
    getLifecycleFunctions(): [
        { [key: string]: ActivationFn },
        { [key: string]: ActivationFn }
    ]

    usePlugin(...plugins: Array<PluginFactory<Dependencies>>): Unsubscribe
    addPlugin(plugin: Plugin): Router<Dependencies>
    getPlugins(): Array<PluginFactory<Dependencies>>

    useMiddleware(
        ...middlewares: Array<MiddlewareFactory<Dependencies>>
    ): Unsubscribe
    clearMiddleware(): Router
    getMiddlewareFactories: () => Array<MiddlewareFactory<Dependencies>>
    getMiddlewareFunctions: () => Middleware[]

    setDependency(dependencyName: string, dependency: any): Router
    setDependencies(deps: Dependencies): Router
    getDependencies(): Dependencies
    getInjectables(): [Router<Dependencies>, Dependencies]
    executeFactory(
        factory: (
            router?: Router<Dependencies>,
            dependencies?: Dependencies
        ) => any
    ): any

    invokeEventListeners: (eventName, ...args) => void
    removeEventListener: (eventName, cb) => void
    addEventListener: (eventName, cb) => Unsubscribe

    cancel(): Router<Dependencies>
    forward(fromRoute: string, toRoute: string): Router<Dependencies>
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
    )

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

export type Middleware<EnhancedState extends State = State> = (
    toState: State,
    fromState: State,
    done: DoneFn
) => boolean | Promise<any> | EnhancedState | void

export type MiddlewareFactory<
    Dependencies extends DefaultDependencies = DefaultDependencies
> = (router: Router, dependencies: Dependencies) => Middleware

export type PluginFactory<
    Dependencies extends DefaultDependencies = DefaultDependencies
> = (router?: Router, dependencies?: Dependencies) => Plugin

export interface SubscribeState {
    route: State
    previousRoute: State
}

export type SubscribeFn = (state: SubscribeState) => void

export interface Listener {
    next: (val: any) => {}
    [key: string]: any
}

export interface Subscription {
    unsubscribe: Unsubscribe
}
