import RouteNode  from 'route-node';
import withUtils from './core/utils';
import withRouterLifecycle from './core/router-lifecycle';
import withNavigation from './core/navigation';
import withMiddleware from './core/middleware';
import withPlugins from './core/plugins';
import withRouteLifecycle from './core/route-lifecycle';
import withCloning from './core/clone';
import constants from './constants';

const defaultOptions = {
    trailingSlash: 0,
    useTrailingSlash: undefined,
    autoCleanUp: true,
    strictQueryParams: true,
    allowNotFound: false
};

/**
 * Create a router
 * @param  {Array}  [routes]          The routes
 * @param  {Object} [options={}]      The router options
 * @param  {Object} [dependencies={}] The router dependencies
 * @return {Object}                   The router instance
 */
function createRouter(routes, opts = {}, deps={}) {
    let routerState = null;
    const callbacks = {};
    const dependencies = deps;
    const options = { ...defaultOptions };

    Object.keys(opts).forEach((opt) => setOption(opt, opts[opt]));

    const router = {
        rootNode,
        getOptions,
        setOption,
        getState,
        setState,
        makeState,
        makeNotFoundState,
        setDependency,
        setDependencies,
        getDependencies,
        add,
        addNode,
        executeFactory,
        addEventListener,
        removeEventListener,
        invokeEventListeners
    };

    /**
     * Invoke all event listeners by event name. Possible event names are listed under constants
     * (`import { constants } from 'router5'`): `ROUTER_START`, `ROUTER_STOP`, `TRANSITION_START`,
     * `TRANSITION_CANCEL`, `TRANSITION_SUCCESS`, `TRANSITION_ERROR`.
     * This method is used internally and should not be invoked directly, but it can be useful for
     * testing purposes.
     * @private
     * @name invokeEventListeners
     * @param  {String}    eventName The event name
     */
    function invokeEventListeners(eventName, ...args) {
        (callbacks[eventName] || []).forEach(cb => cb(...args));
    }

    /**
     * Removes an event listener
     * @private
     * @param  {String}   eventName The event name
     * @param  {Function} cb        The callback to remove
     */
    function removeEventListener(eventName, cb) {
        callbacks[eventName] = callbacks[eventName].filter((_cb) => _cb !== cb);
    }

    /**
     * Add an event listener
     * @private
     * @param {String}   eventName The event name
     * @param {Function} cb        The callback to add
     */
    function addEventListener(eventName, cb) {
        callbacks[eventName] = (callbacks[eventName] || []).concat(cb);

        return () => removeEventListener(eventName, cb);
    }

    withUtils(router);
    withPlugins(router);
    withMiddleware(router);
    withRouteLifecycle(router);
    withRouterLifecycle(router);
    withNavigation(router);
    withCloning(router, createRouter);

    const rootNode  = routes instanceof RouteNode
        ? routes
        : new RouteNode('', '', routes, addCanActivate);

    router.rootNode = rootNode;

    return router;

    function addCanActivate(route) {
        if (route.canActivate) router.canActivate(route.name, route.canActivate);
    }

    /**
     * Build a state object
     * @param  {String} name         The state name
     * @param  {Object} params       The state params
     * @param  {String} path         The state path
     * @param  {Object} [metaParams] Description of the state params
     * @param  {String} [source]     The source of the routing state
     * @return {Object}              The state object
     */
    function makeState(name, params, path, metaParams, source) {
        const state = {};
        const setProp = (key, value) => Object.defineProperty(state, key, { value, enumerable: true });
        setProp('name', name);
        setProp('params', params);
        setProp('path', path);
        if (metaParams || source) {
            const meta = { params: metaParams };

            if (source) meta.source = source;

            setProp('meta', meta);
        }
        return state;
    }

    /**
     * Build a not found state for a given path
     * @param  {String} path The unmatched path
     * @return {Object}      The not found state object
     */
    function makeNotFoundState(path) {
        return makeState(constants.UNKNOWN_ROUTE, { path }, path, {});
    }

    /**
     * Get the current router state
     * @return {Object} The current state
     */
    function getState() {
        return routerState;
    }

    /**
     * Set the current router state
     * @param {Object} state The state object
     */
    function setState(state) {
        routerState = state;
    }

    /**
     * Get router options
     * @return {Object} The router options
     */
    function getOptions() {
        return options;
    }

    /**
     * Set an option
     * @param  {String} option The option name
     * @param  {*}      value  The option value
     * @return {Object}       The router instance
     */
    function setOption(option, value) {
        if (option === 'useTrailingSlash' && value !== undefined) {
            options.trailingSlash = true;
        }
        options[option] = value;
        return router;
    }

    /**
     * Set a router dependency
     * @param  {String} dependencyName The dependency name
     * @param  {*}      dependency     The dependency
     * @return {Object}                The router instance
     */
    function setDependency(dependencyName, dependency) {
        dependencies[dependencyName] = dependency;
        return router;
    }

    /**
     * Add dependencies
     * @param { Object} deps A object of dependencies (key-value pairs)
     * @return {Object}      The router instance
     */
    function setDependencies(deps) {
        Object.keys(deps).forEach((depName) => {
            dependencies[depName] = deps[depName];
        });

        return router;
    }

    /**
     * Get dependencies
     * @return {Object} The dependencies
     */
    function getDependencies() {
        return dependencies;
    }

    function getInjectables() {
        return [ router, getDependencies() ];
    }

    function executeFactory(factoryFunction) {
        return factoryFunction(...getInjectables());
    }

    /**
     * Add routes
     * @param  {Array} routes A list of routes to add
     * @return {Object}       The router instance
     */
    function add(routes) {
        rootNode.add(routes, addCanActivate);
        return router;
    }

    /**
     * Add a single route (node)
     * @param {String} name                   The route name (full name)
     * @param {String} path                   The route path (from parent)
     * @param {Function} [canActivateHandler] The canActivate handler for this node
     */
    function addNode(name, path, canActivateHandler) {
        router.rootNode.addNode(name, path);
        if (canActivateHandler) router.canActivate(name, canActivateHandler);
        return router;
    }
}

export default createRouter;
