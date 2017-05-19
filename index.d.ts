// Type definitions for router5
// Project: https://github.com/router5/router5
// Definitions by: Matthew Dahl <https://github.com/sandersky>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


interface constants {
    ROUTER_NOT_STARTED: string;
    ROUTER_ALREADY_STARTED: string;
    ROUTE_NOT_FOUND: string;
    SAME_STATES: string;
    CANNOT_DEACTIVATE: string;
    CANNOT_ACTIVATE: string;
    TRANSITION_ERR: string;
    TRANSITION_CANCELLED: string;
}

interface State {
    _meta: Array<Object>;
    name: string;
    params: Object;
}

interface RouteNode {
    add(route: any, cb?: Function): RouteNode;
    addNode(name?: any, params?: any): RouteNode;
    buildPath(routeName: string, params?: Object): string;
    buildPathFromSegments(segment: Array<Object>, params?: Object): string;
    buildState(name: string, params?: Object): State;
    buildStateFromSegments(segments: Array<Object>): State;
    getMetaFromSegments(segments: Array<Object>): Array<Object>;
    getPath(routeName: string): string;
    getPathFromSegments(segments: Array<Object>): string;
    getSegmentsByName(routeName: string): Array<Object>;
    getSegmentsMatchingPath(path: any, options: Object): Array<any>;
    matchPath(path: any, options?: Object): State;
    setPath(path?: any): void;
}

interface RouteNodeFactory {
    new (name?: any, path?: any, childRoutes?: any, cb?: Function): RouteNode;
    (name?: any, path?: any, childRoutes?: any, cb?: Function): RouteNode;
}

interface Router5 {
    add(routes: any): Router5;
    addNode(name: string, path: string, canActivate?: Function): Router5;
    areStatesDescendants(parentState: any, childState: any): Boolean;
    areStatesEqual(state1: any, state2: any): Boolean;
    buildPath(route: string, params: Object): string;
    buildState(route: string, params: Object): string;
    buildUrl(route: string, params: Object): string;
    canActivate(name: string, canActivate: Function): Router5;
    canDeactivate(name: string, canDeactivate: Boolean): any;
    cancel(): void;
    getAdditionalArgs(): Array<any>;
    getState(): Object;
    isActive(name: string, params?: Object, strictEquality?: Boolean, ignoreQueryParams?: Boolean): Boolean;
    matchPath(path: string): Object;
    matchUrl(url: string): Object;
    navigate(name: string, ...args: Array<Object | Function>): Function;
    setAdditionalArgs(args: Array<any>): void;
    setOption(opt: string, val: any): Router5;
    setDependency(dependencyName: string, dependency: any): Router5;
    setDependencies(dependencies: { [name: string]: any }): Router5;
    start(...args: Array<any>): Router5;
    stop(): Router5;
    urlToPath(path: string): string;
    useMiddleware(...args: Array<Function>): Router5;
    usePlugin(pluginFactory: PluginFactory): Router5;
}

interface TrasitionOptions {
    replace: boolean;
    reload: boolean;
}

export interface PluginCallbacks {
    onTransitionSuccess?: (toState: State, fromState: State | undefined, opts: TrasitionOptions) => void;
    onTransitionStart?: (toState: State, fromState?: State) => void;
    onTransitionCancel?: (toState: State, fromState?: State) => void;
    onTransitionError?: (toState: State, fromState: State | undefined, err: any) => void;
    onStart?: () => void;
    onStop?: () => void;
}

export interface PluginFactory {
    (): PluginCallbacks;
    pluginName?: string;
}


interface Router5Factory {
    new (routes?: any, opts?: Object): Router5;
    (routes?: any, opts?: Object): Router5;
}

declare var errCodes: constants;
declare var loggerPlugin: () => PluginFactory;
declare var RouteNode: RouteNodeFactory;
declare var Router5: Router5Factory;
declare var transitionPath: (toState: any, fromState: any) => any;

export default Router5;
export {
    errCodes,
    loggerPlugin,
    RouteNode,
    Router5,
    transitionPath
};
