var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import RouteNode from 'route-node';
import withUtils from './core/utils';
import withRouterLifecycle from './core/router-lifecycle';
import withNavigation from './core/navigation';
import withMiddleware from './core/middleware';
import withPlugins from './core/plugins';
import withRouteLifecycle from './core/route-lifecycle';
import withCloning from './core/clone';
import constants from './constants';

var defaultOptions = {
    trailingSlash: 0,
    useTrailingSlash: undefined,
    autoCleanUp: true,
    strictQueryParams: true,
    allowNotFound: false,
    strongMatching: true
};

/**
 * Create a router
 * @param  {Array}  [routes]          The routes
 * @param  {Object} [options={}]      The router options
 * @param  {Object} [dependencies={}] The router dependencies
 * @return {Object}                   The router instance
 */
function createRouter(routes) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var routerState = null;
    var callbacks = {};
    var dependencies = deps;
    var options = _extends({}, defaultOptions);

    Object.keys(opts).forEach(function (opt) {
        return setOption(opt, opts[opt]);
    });

    var router = {
        rootNode: rootNode,
        getOptions: getOptions,
        setOption: setOption,
        getState: getState,
        setState: setState,
        makeState: makeState,
        makeNotFoundState: makeNotFoundState,
        setDependency: setDependency,
        setDependencies: setDependencies,
        getDependencies: getDependencies,
        add: add,
        addNode: addNode,
        executeFactory: executeFactory,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        invokeEventListeners: invokeEventListeners
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
    function invokeEventListeners(eventName) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        (callbacks[eventName] || []).forEach(function (cb) {
            return cb.apply(undefined, args);
        });
    }

    /**
     * Removes an event listener
     * @private
     * @param  {String}   eventName The event name
     * @param  {Function} cb        The callback to remove
     */
    function removeEventListener(eventName, cb) {
        callbacks[eventName] = callbacks[eventName].filter(function (_cb) {
            return _cb !== cb;
        });
    }

    /**
     * Add an event listener
     * @private
     * @param {String}   eventName The event name
     * @param {Function} cb        The callback to add
     */
    function addEventListener(eventName, cb) {
        callbacks[eventName] = (callbacks[eventName] || []).concat(cb);

        return function () {
            return removeEventListener(eventName, cb);
        };
    }

    withUtils(router);
    withPlugins(router);
    withMiddleware(router);
    withRouteLifecycle(router);
    withRouterLifecycle(router);
    withNavigation(router);
    withCloning(router, createRouter);

    var rootNode = routes instanceof RouteNode ? routes : new RouteNode('', '', routes, addCanActivate);

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
        var state = {};
        var setProp = function setProp(key, value) {
            return Object.defineProperty(state, key, { value: value, enumerable: true });
        };
        setProp('name', name);
        setProp('params', params);
        setProp('path', path);
        if (metaParams || source) {
            var meta = { params: metaParams };

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
        return makeState(constants.UNKNOWN_ROUTE, { path: path }, path, {});
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
        Object.keys(deps).forEach(function (depName) {
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
        return [router, getDependencies()];
    }

    function executeFactory(factoryFunction) {
        return factoryFunction.apply(undefined, _toConsumableArray(getInjectables()));
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