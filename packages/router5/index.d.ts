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

  export interface StateMeta {
      id: string;
      params: object;
  }

  export interface State {
    meta?: StateMeta;

    name: string;
    params: any;
    path: string;
  }

  export interface NavigationOptions {
    replace?: boolean;
    reload?: boolean;
    force?: boolean;
    skipTransition?: boolean;
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
    (router: Router, dependencies?: object): Plugin;
  }

  export interface Middleware {
    (toState: State, fromState: State, done?: Function): any;
  }

  export interface MiddlewareFactory {
    (router: Router, dependencies: object): Middleware;
  }

  export interface RouterOptions {
    /* The default route: When your router instance starts, it will navigate to a default route if such route is defined and if it cannot match the URL against a known route. */
    defaultRoute?: string;

    /*  the default route params (defaults to {}) */
    defaultParams?: any;

    /*
    By default, the router is in "strict match" mode. If you want trailing slashes to be optional, you can set trailingSlash to a truthy value.
    */
    trailingSlash?: boolean;

    /*
    By default, the router will build your routes according to your route definitions. You can force or not the use of trailing slashes by setting useTrailingSlash to true or false (default to undefined); When setting this option, trailingSlash will be set to true (non strict matching).
    */
    useTrailingSlash?: boolean;

    /*
    If autoCleanUp is set to true, the router will automatically clear canDeactivate functions / booleans when their associated segment becomes inactive.
    */
    autoCleanUp?: true;

    /*
    Query parameters are optional, meaning a route can still be matched if a query parameter defined in its path is not present. However, if extra query parameters are present in the path which is being matched, matching will fail.

    If you want the router to still match routes if extra query parameters are present, set strictQueryParams to false.
    */
    strictQueryParams?: true;

    /*
    There are two ways to deal with not found routes: the first one is to configure a defaultRoute (and defaultParams), the second one is to allow those not found routes to create a new routing state. Set allowNotFound to true and the router will emit a state value for unmatched paths.
    */
    allowNotFound?: true;
  }

  export interface Router {
    /**
     * Add routes
     *
     * @param routes A list of routes to add
     * @returns The router instance
     */
    add(routes: Array<Route>): Router;

    /**
     * Add a single route (node)
     *
     * @param name The route name (full name)
     * @param path The route path (from parent)
     * @param canActivate The canActivate handler for this node
     */
    addNode(name: string, path: string, canActivate?: RouterActivationHandlerFactory): void;

    /**
     * Check if two states are related
     *
     * @param parentState The parent state
     * @param childState The child state
     * @returns Whether the two states are descendants or not
     */
    areStatesDescendants(parentState: any, childState: any): Boolean;

    /**
     * Compare two route state objects
     *
     * @param state1 The route state
     * @param state2 The other route state
     * @param ignoreQueryParams Whether to ignore query parameters or not
     * @returns Whether the two route state are equal or not
     */
    areStatesEqual(state1: any, state2: any, ignoreQueryParams?:boolean): Boolean;

    /**
     * Build a path
     *
     * @param route The route name
     * @param params The route params
     * @returns The path
     */
    buildPath(route: string, params: Object): string;

    /**
     * Register a canActivate handler or specify a if a route can be deactivated
     *
     * @param name The route name
     * @param canActivate The canActivate handler or boolean
     * @returns The router instance
     */
    canActivate(name: string, canActivate: RouterActivationHandlerFactory | boolean): Router;

    /**
     * Register a canDeactivate handler or specify a if a route can be deactivated
     *
     * @param name The route name
     * @param canDeactivate The canDeactivate handler or boolean
     * @returns The router instance
     */
    canDeactivate(name: string, canDeactivate: RouterActivationHandlerFactory | boolean): Router;

    /**
     * Cancel the current transition if there is one
     */
    cancel(): void;

    /**
     * Remove all middleware functions
     * @returns {}
     */
    clearMiddleware() : Router;

    /**
     * Clone the current router configuration. The new returned router will be non-started, with a null state
     *
     * @param dependencies An object of dependencies (key-value pairs)
     * @returns Cloned router
     */
    clone(dependencies: object): Router;

    /**
     * Forward a route to another route, when calling navigate. Route parameters for the two routes should match to avoid issues.
     *
     * @param fromRoute The route name
     * @param toRoutes The route name
     * @returns The router instance
     */
    forward(fromRoute : string, toRoute : string) : Router;

    /**
     * Get dependencies
     *
     * @returns The dependencies
     */
    getDependencies():object;

    /**
     * Get router options
     */
    getOptions() : RouterOptions;

    /**
     * Get the current router state
     * @returns The current state
     */
    getState(): State;

    /**
     * Check if a plugin has already been registered.
     *
     * @param pluginName The plugin name
     * @returns Whether the plugin has been registered
     */
    hasPlugin(pluginName:string) : boolean;

    /**
     * Check if a route is currently active
     *
     * @param name The route name
     * @param params The route params
     * @param strictEquality Whether to check if the given route is the active route, or part of the active route
     * @param ignoreQueryParams Whether to ignore query parameters
     * @returns Whether the given route is active
     */
    isActive(name: string, params?: Object, strictEquality?: Boolean, ignoreQueryParams?: Boolean): Boolean;

    /**
     * Check if the router is started
     * @returns Whether the router is started or not
     */
    isStarted() : boolean;

    /**
     * Build a not found state for a given path
     *
     * @param path The unmatched path
     * @returns The not found state object
     */
    makeNotFoundState(path: string): State;

    /**
     * Build a state object
     *
     * @param name The state name
     * @param params The state params
     * @param path The state path
     * @param metaParams Description of the state params
     * @param source The source of the routing state
     * @returns The state object
     */
    makeState(name : string, params : any, path : string, metaParams ?: any, source?:string): State;


    /**
     * Match a path
     *
     * @param path The path to match
     * @param source The source (optional, used internally)
     * @returns The matched state (null if unmatched)
     */
    matchPath(path: string, source ?: string): State | null;

    /**
     * Navigate to a route
     *
     * @param routeName The route name
     * @param routeParams The route params
     * @param options The navigation options (`replace`, `reload`)
     * @param done A done node style callback (err, state)
     * @returns {}
     */
    navigate(routeName: string, routeParams?: any, options ?: NavigationOptions, done ?: Function): Function;

    /**
     * Navigate to the default route (if defined)
     *
     * @param opts The navigation options
     * @param done A done node style callback (err, state)
     * @returns A cancel function
     */
    navigateToDefault(opts ?: NavigationOptions, done?: Function) : Function;

    /**
     * Add dependencies
     * @param dependencies An object of dependencies (key-value pairs)
     * @returns The router instance
     */
    setDependencies(dependencies: object): Router;

    /**
     * Set a router dependency
     *
     * @param dependencyName The dependency name
     * @param dependency The dependency
     * @returns The router instance
     */
    setDependency(dependencyName: string, dependency : any): Router;

    /**
     * Set an option
     *
     * @param opt The option name
     * @param val The option value
     * @returns The router instance
     */
    setOption(opt: string, val: any): Router;

    /**
     * Set the current router state
     *
     * @param state The state object
     */
    setState(state : State) : void;

    /**
     * Start the router
     *
     * @param startPathOrState The start path or state. This is optional when using the browser plugin.
     * @param done A done node style callback (err, state)
     * @returns The router instance
     */
    start(startPathOrState ?: string|State, done?:Function): Router;

    /**
     * Stop the router
     *
     * @returns The router instance
     */
    stop(): Router;

    /**
     * Register middleware functions.
     *
     * @param args The middleware functions
     * @returns The router instance
     */
    useMiddleware(...args: Array<MiddlewareFactory>): Router;

    /**
     * Use plugins
     * @param pluginFactory An argument list of plugins
     * @returns The router instance
     */
    usePlugin(...args: Array<PluginFactory>): Router;

    /**
     * Set the root node path, use carefully. It can be used to set app-wide allowed query parameters.
     *
     * @param rootPath The root node path
     */
    setRootPath(rootPath : string) : void;
  }

  /**
   * The result can be synchronous (returning a boolean) or asynchronous (returning a promise or calling done(err, result))
   */
  export type RouterActivationHandler = (tostring: State, fromState: State, done:(err:any,result:any) => void) => boolean | Promise<boolean> | undefined;
  export type RouterActivationHandlerFactory = (router: Router, dependencies: object) => RouterActivationHandler;

  export interface Route {
    name: string;
    path: string;

    /**
     * if specified, the router will transition to the forwarded route instead. It is useful for defaulting to a child route, or having multiple paths pointing to the same route.
     */
    forwardTo?: string;

    /**
     * a method to control whether or not the route node can be activated
     */
    canActivate?: RouterActivationHandlerFactory;

    children?: Array<Route>;
  }

  /*
    Create a router

    @param routes The routes
    @param options The router options
    @param dependencies The router dependencies
  */
  export function createRouter(routes?: Array<Route>, options?: RouterOptions, dependencies?: object): Router;

  export var errorCodes: ErrorCodes;
  export var constants: Constants;
  export var transitionPath: (toState: State, fromState: State | null) => any;
  export var loggerPlugin: PluginFactory;

  export default createRouter;
}

declare module "router5/plugins/browser" {
  import { PluginFactory } from "router5";
  interface BrowserPluginOptions {
    forceDeactivate?: boolean;
    useHash?: boolean;
    hashPrefix?: string;
    base?: string;
    mergeState?: boolean;
    preserveHash?: boolean;
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

declare module "router5/plugins/persistentParams" {
  import { PluginFactory } from "router5";
  // persistentParamsPlugin takes a single argument which can be:
  //   - A list of string (parameter names to persist), or
  //   - A map of key value pairs (keys being the params to persist, values their initial value)
  type PersistentParamsPluginParams = string[] | object;
  var persistentParamsPlugin: (params?: PersistentParamsPluginParams) => PluginFactory;
  export default persistentParamsPlugin;
}
