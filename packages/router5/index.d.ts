declare module 'router5' {
    import constants, {
        Constants,
        errorCodes,
        ErrorCodes
    } from 'router5/constants'
    import createRouter, {
        Dependencies,
        Params,
        Route,
        Router,
        State,
        StateMeta,
        Options as RouterOptions
    } from 'router5/create-router'
    import {
        CancelFn,
        Options as NavigationOptions
    } from 'router5/core/navigation'
    import {
        SubscribeFn,
        UnsubscribeFn,
        SubscribeState
    } from 'router5/core/observable'
    import { Middleware, MiddlewareFactory } from 'router5/core/middleware'
    import { Plugin, PluginFactory } from 'router5/core/plugins'
    import {
        ActivationFn,
        ActivationFnFactory
    } from 'router5/core/route-lifecycle'
    import loggerPlugin from 'router5/plugins/logger'
    import transitionPath from 'router5-transition-path'

    type DoneFn = (err?: any, state?: State) => void

    export {
        createRouter,
        // RouteNode,
        loggerPlugin,
        errorCodes,
        transitionPath,
        constants,
        ActivationFn,
        ActivationFnFactory,
        CancelFn,
        Constants,
        Dependencies,
        DoneFn,
        ErrorCodes,
        Middleware,
        MiddlewareFactory,
        NavigationOptions,
        Params,
        Plugin,
        PluginFactory,
        Route,
        Router,
        RouterOptions,
        State,
        StateMeta,
        SubscribeFn,
        UnsubscribeFn,
        SubscribeState
    }

    export default createRouter
}

declare module 'router5/constants' {
    export interface ErrorCodes {
        ROUTER_NOT_STARTED: string
        NO_START_PATH_OR_STATE: string
        ROUTER_ALREADY_STARTED: string
        ROUTE_NOT_FOUND: string
        SAME_STATES: string
        CANNOT_DEACTIVATE: string
        CANNOT_ACTIVATE: string
        TRANSITION_ERR: string
        TRANSITION_CANCELLED: string
    }

    export interface Constants {
        UNKNOWN_ROUTE: string
        ROUTER_START: string
        ROUTER_STOP: string
        TRANSITION_START: string
        TRANSITION_CANCEL: string
        TRANSITION_SUCCESS: string
        TRANSITION_ERROR: string
    }

    const constants: Constants

    export const errorCodes: ErrorCodes
    export default constants
}

declare module 'router5/create-router' {
    import { ActivationFnFactory } from 'router5/core/route-lifecycle'
    import { Options as NavigationOptions } from 'router5/core/navigation'
    import {
        TrailingSlashMode,
        QueryParamsMode,
        QueryParamsOptions
    } from 'route-node'

    export interface Dependencies {
        [key: string]: any
    }

    export interface Params {
        [key: string]: any
    }

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

    export interface StateMeta {
        id: number
        params: Params
        options: NavigationOptions
        redirected: Boolean
        source?: string
    }

    export interface State {
        name: string
        params: Params
        path: string
        meta?: StateMeta
    }

    export interface Options {
        defaultRoute: string
        defaultParams: Params
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

    export interface Router {
        makeState(
            name: string,
            params: Params,
            path: string,
            metaParams?: Params,
            source?: string,
            forceId?: number
        ): State
        makeNotFoundState(path: string): State
        getState(): State
        setState(state: State): void
        getOptions(): Options
        setOption(option: string, value: any): Router
        setDependency(dependencyName: string, dependency: any): Router
        setDependencies(deps: Dependencies): Router
        getDependencies(): Dependencies
        add(routes: Route[] | Route, finalSort?: boolean): Router
        addNode(
            name: string,
            path: string,
            canActivateHandler?: ActivationFnFactory
        ): Router
    }

    function createRouter(
        routers: Route[],
        options?: Partial<Options>,
        dependencies?: Dependencies
    ): Router

    export default createRouter
}

declare module 'router5/core/clone' {
    module 'router5/create-router' {
        interface Router {
            clone(deps?: Dependencies): Router
        }
    }
}

declare module 'router5/core/middleware' {
    import { DoneFn } from 'router5'
    import { Dependencies, State, Router } from 'router5/create-router'

    export type Middleware = (
        toState: State,
        fromState: State,
        done: DoneFn
    ) => boolean | Promise<any> | void

    export type MiddlewareFactory = (
        router: Router,
        dependencies: Dependencies
    ) => Middleware

    module 'router5/create-router' {
        interface Router {
            useMiddleware(...middlewares: MiddlewareFactory[]): Router
            clearMiddleware(): Router
        }
    }
}

declare module 'router5/core/navigation' {
    import { DoneFn } from 'router5'

    export type CancelFn = () => void

    export interface Options {
        replace?: boolean
        reload?: boolean
        skipTransition?: boolean
        force?: boolean
        [key: string]: any
    }

    type NavigationOptions = Options

    module 'router5/create-router' {
        interface Router {
            cancel(): Router
            forward(fromRoute: string, toRoute: string): Router
            navigate(
                routeName: string,
                routeParams: Params,
                options: NavigationOptions,
                done?: DoneFn
            ): CancelFn
            navigate(
                routeName: string,
                routeParams: Params,
                done?: DoneFn
            ): CancelFn
            navigate(routeName: string, done?: DoneFn): CancelFn
            navigateToDefault(opts: NavigationOptions, done?: DoneFn): CancelFn
            navigateToDefault(done?: DoneFn): CancelFn
        }
    }
}

declare module 'router5/core/observable' {
    import { State } from 'router5'

    export interface SubscribeState {
        route: State
        previousRoute: State
    }
    export type SubscribeFn = (state: SubscribeState) => void
    export type UnsubscribeFn = () => void

    module 'router5/create-router' {
        interface Router {
            subscribe(cb: SubscribeFn): UnsubscribeFn
        }
    }
}

declare module 'router5/core/plugins' {
    import { Dependencies, Router, State } from 'router5/create-router'
    import { NavigationOptions } from 'router5/core/navigation'

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

    export interface PluginFactory {
        pluginName: string
        (router: Router, dependencies?: Dependencies): Plugin
    }

    module 'router5/create-router' {
        interface Router {
            usePlugin(...plugins: PluginFactory[]): Router
            hasPlugin(pluginName: string): boolean
        }
    }
}

declare module 'router5/core/route-lifecycle' {
    import { DoneFn } from 'router5'
    import { Dependencies, Router, State } from 'router5/create-router'

    export type ActivationFn = (
        toState: State,
        fromState: State,
        done: DoneFn
    ) => boolean | Promise<boolean> | void
    export type ActivationFnFactory = (
        router: Router,
        dependencies?: Dependencies
    ) => ActivationFn

    module 'router5/create-router' {
        interface Router {
            canDeactivate(
                name: string,
                canDeactivateHandler: ActivationFnFactory | boolean
            ): Router
            clearCanDeactivate(name: string): Router
            canActivate(
                name: string,
                canActivateHandler: ActivationFnFactory | boolean
            ): Router
        }
    }
}

declare module 'router5/core/router-lifecycle' {
    import { DoneFn } from 'router5'
    import { State } from 'router5/create-router'

    module 'router5/create-router' {
        interface Router {
            isStarted(): boolean
            start(startPathOrState: string | State, done?: DoneFn): Router
            start(done?: DoneFn): Router
            stop(): Router
        }
    }
}

declare module 'router5/core/utils' {
    module 'router5/create-router' {
        interface Router {
            isActive(
                name: string,
                params?: Params,
                strictEquality?: boolean,
                ignoreQueryParams?: boolean
            ): boolean

            areStatesEqual(
                state1: State,
                state2: State,
                ignoreQueryParams?: boolean
            ): boolean

            areStatesDescendants(parentState: State, childState: State): boolean
            buildPath(route: string, params: Params): string
            matchPath(path: string, source?: string): State | null
            setRootPath(rootPath: string): void
        }
    }
}

declare module 'router5/plugins/browser' {
    import { PluginFactory } from 'router5/core/plugins'

    export interface Options {
        forceDeactivate?: boolean
        useHash?: boolean
        hashPrefix?: string
        base?: string
        mergeState?: boolean
        preserveHash?: boolean
    }

    // compatibility
    export type BrowserPluginOptions = Options

    function browserPluginFactory(opts?: Options): PluginFactory

    export default browserPluginFactory
}

declare module 'router5/plugins/browser/utils' {
    module 'router5/create-router' {
        interface Router {
            buildUrl(route: string, params: Params): string
            urlToPath(url: string): string
            matchUrl(url: string): State | null
        }
    }
}

declare module 'router5/plugins/listeners' {
    import { PluginFactory } from 'router5/core/plugins'

    export interface Options {
        autoCleanUp?: boolean
    }

    // compatibility
    export type ListenersPluginOptions = Options

    function listenersPluginFactory(options?: Options): PluginFactory

    export default listenersPluginFactory
}

declare module 'router5/plugins/logger' {
    import { PluginFactory } from 'router5/core/plugins'
    const loggerPlugin: PluginFactory
    export default loggerPlugin
}

declare module 'router5/plugins/persistentParams' {
    import { Params } from 'router5/create-router'
    import { PluginFactory } from 'router5/core/plugins'

    function persistentParamsPluginFactory(
        params?: string[] | Params
    ): PluginFactory

    export default persistentParamsPluginFactory
}
