declare module "router5" {
  export interface ErrorCodes {
    ROUTER_NOT_STARTED: string;
    NO_START_PATH_OR_STATE: string;
    ROUTER_ALREADY_STARTED: string;
    ROUTE_NOT_FOUND: string;
    SAME_STATES: string;
    CANNOT_DEACTIVATE: string;
    CANNOT_ACTIVATE: string;
    TRANSITION_ERR: string;
    TRANSITION_CANCELLED: string;
  }

  export interface Constants {
    UNKNOWN_ROUTE: string;
    ROUTER_START: string;
    ROUTER_STOP: string;
    TRANSITION_START: string;
    TRANSITION_CANCEL: string;
    TRANSITION_SUCCESS: string;
    TRANSITION_ERROR: string;
  }

  export interface State {
    meta?: object;
    name: string;
    params: any;
    path: string;
  }

  export interface NavigationOptions {
    replace?: boolean;
    reload?: boolean;
  }

  export interface Plugin {
    onStart?(): void;
    onStop?(): void;
    onTransitionStart?(toState: State, fromState: State): void;
    onTransitionCancel?(toState: State, fromState: State): void;
    onTransitionError?(toState: State, fromState: State, err: any): void;
    onTransitionSuccess?(toState: State, fromState: State, options: NavigationOptions): void;
  }

  export interface PluginFactory {
    pluginName?: string;
    (router: Router, dependencies?: any): Plugin;
  }

  export interface Middleware {
    (toState: State, fromState: State, done?: Function): any;
  }

  export interface MiddlewareFactory {
    (router: Router, dependencies: any): Middleware;
  }

  export interface RouterOptions {
    defaultRoute?: string;
    defaultParams?: object;
    trailingSlash?: boolean;
    useTrailingSlash?: undefined | boolean;
    autoCleanUp?: boolean;
    strictQueryParams?: boolean;
    allowNotFound?: boolean;
  }

  export interface Router {
    makeState(name: string, params: object, path: string, metaParams?: object, source?: string): object;
    makeNotFoundPath(path: string): object;
    getState(): State;
    setState(state: State): State;
    getOptions(): RouterOptions;
    setOption(option: string, value: any): Router;
    setDependency(dependencyName: string, dependency: any): Router;
    setDependencies(deps: Array<{name: string, value: any}>): Router;
    getDependencies(): object;
    add(routes: Array<any>): Router;
    addNode(name: string, path: string, canActivateHandler: Function): Router;

    // router lifecycle
    isStarted(): boolean;
    start(startPathOrState?: string | State, done?: Function): Router;
    stop(): Router;

    // navigation
    cancel(): Router;
    navigate(routeName: string, routeParams?: object, options?: NavigationOptions, done?: Function): Function;
    navigateToDefault(options?: NavigationOptions, done?: Function): Function;

    // route lifecycle
    canActivate(name: string, canActivateHandler: Function | boolean): Router;
    canDeactivate(name: string, canDeactivateHandler: Function | boolean): Router;
    clearCanDeactivate(name: string): Router;

    // middlewares
    useMiddleware(...middlewares: Array<MiddlewareFactory>): Router;
    clearMiddleware(): Router;

    // plugins
    usePlugin(...plugins: Array<PluginFactory>): Router;
    hasPlugin(name: string): boolean;

    // utils
    isActive(name: string, params: object, strictEquality?: boolean, ignoreQueryParams?: boolean): boolean;
    areStatesEqual(state1: State, state2: State, ignoreQueryParams: boolean): boolean;
    areStatesDescendants(parent: State, child: State): boolean;
    buildPath(route: string, params: object): string;
    matchPath(path: string, source?: string): object;
    setRootPath(rootPath: string): void;
  }


  export var errorCodes: ErrorCodes;
  export var constants: Constants;
  export var transitionPath: (toState: any, fromState: any) => any;
  export var loggerPlugin: PluginFactory;

  var createRouter: (routes?: any, options?: any, dependencies?: any) => Router;
  export default createRouter;
}

declare module "router5/plugins/browser" {
  import { PluginFactory } from "router5";
  interface BrowserPluginOptions {
    forceDeactivate?: boolean;
    useHash?: boolean;
    hashPrefix?: string;
    base?: string;
  }

  var browserPlugin: (options: BrowserPluginOptions) => PluginFactory;
  export default browserPlugin;
}

declare module "router5/plugins/listeners" {
  import { PluginFactory } from "router5";
  interface ListenersPluginOptions {
    autoCleanUp: boolean;
  }

  var listenersPlugin: (options?: ListenersPluginOptions) => PluginFactory;
  export default listenersPlugin;
}
