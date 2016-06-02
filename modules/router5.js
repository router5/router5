import RouteNode  from 'route-node';
import transition from './transition';
import constants  from './constants';

const noop = () => {};
const ifNot = (condition, error) => {
    if (!condition) throw new Error(error);
};

const makeState = (name, params, path, _meta) => {
    const state = {};
    const setProp = (key, value) => Object.defineProperty(state, key, { value, enumerable: true });
    setProp('name', name);
    setProp('params', params);
    setProp('path', path);
    if (_meta) setProp('_meta', _meta);
    return state;
};

const addCanActivate = router => route => {
    if (route.canActivate) router.canActivate(route.name, route.canActivate);
};

const toFunction = (val) => typeof val === 'function' ? val : () => () => val;

/**
 * Create a new Router5 instance
 * @class
 * @param {RouteNode[]|Object[]|RouteNode|Object} routes The router routes
 * @param {Object} [opts={}] The router options: useHash, defaultRoute and defaultParams can be specified.
 * @return {Router5} The router instance
 */
class Router5 {
    constructor(routes, opts = {}) {
        this.started = false;
        this._cbs = {};
        this._mware = [];
        this.__mware = [];
        this._canAct = {};
        this.__canAct = {};
        this._canDeact = {};
        this.__canDeact = {};
        this.lastStateAttempt = null;
        this.lastKnownState = null;
        this.rootNode  = routes instanceof RouteNode
            ? routes
            : new RouteNode('', '', routes, addCanActivate(this));
        this.options = {
            useHash: false,
            hashPrefix: '',
            base: false,
            trailingSlash: 0,
            autoCleanUp: true,
            strictQueryParams: true
        };
        Object.keys(opts).forEach(opt => this.options[opt] = opts[opt]);
        this._plugins = [];
        this._diArgs = [];
    }

    /**
     * Set an option value
     * @param  {String} opt The option to set
     * @param  {*}      val The option value
     * @return {Router5}    The Router5 instance
     */
    setOption(opt, val) {
        this.options[opt] = val;
        return this;
    }

    /**
     * Inject additional arguments in lifecycle and middleware functions.
     * Additional arguments are used in canActivate, canDeactivate and middleware functions after your router instance.
     * @param  {Array} args The additional arguments
     */
    inject(...args) {
        this._DIArgs = args;
        return this;
    }

    /**
     * Return additional arguments used in lifecycle functions
     */
    getInjectables() {
        return this._DIArgs;
    }

    /**
     * @private
     */
    _getDI() {
        return [ this ].concat(this.getInjectables());
    }

    /**
     * Add route(s)
     * @param  {RouteNode[]|Object[]|RouteNode|Object} routes Route(s) to add
     * @return {Router5}  The Router5 instance
     */
    add(routes) {
        this.rootNode.add(routes, addCanActivate(this));
        return this;
    }

    /**
     * Add a route to the router.
     * @param {String}   name          The route name
     * @param {String}   path          The route path
     * @param {Function} [canActivate] A function to determine if the route can be activated.
     *                                 It will be invoked during a transition with `toState`
     *                                 and `fromState` parameters.
     * @return {Router5}             The Router5 instance
     */
    addNode(name, path, canActivate) {
        this.rootNode.addNode(name, path);
        if (canActivate) this.canActivate(name, canActivate);
        return this;
    }

    usePlugin(plugin) {
        this._plugins.push(plugin);
        return this;
    }

    /**
     * Set a transition middleware function `.useMiddleware(fn1, fn2, fn3, ...)`
     * @param {Function} fn The middleware function
     */
    useMiddleware(...args) {
        this._mware = args;
        return this;
    }

    _applyFunctions() {
        const injectables = this._getDI();
        const applyFn = (fn) => fn(...injectables);
        const reduceAndApply = (map) => Object.keys(map).reduce(
            (appliedMap, key) => {
                appliedMap[key] = applyFn(map[key]);
                return appliedMap;
            },
            {}
        );
        const pluginMethods = ['onStart', 'onStop', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];

        this.__mware = this._mware.map(applyFn);
        this.__canAct = reduceAndApply(this._canAct);
        this.__canDeact = reduceAndApply(this._canDeact);
        this._plugins.forEach((plugin) => {
            const appliedPlugin = applyFn(plugin);

            pluginMethods.forEach((methodName) => {
                if (appliedPlugin[methodName]) {
                    this._addListener(
                        methodName.toLowerCase().replace(/^on/, '$$').replace(/transition/, '$$'),
                        appliedPlugin[methodName]
                    );
                }
            });
        });
    }

    /**
     * Start the router
     * @param  {String|Object} [startPathOrState] An optional start path or state
     *                                            (use it for universal applications)
     * @param  {Function}      [done]             An optional callback which will be called
     *                                            when starting is done
     * @return {Router5}  The router instance
     */
    start(...args) {
        const lastArg = args.slice(-1)[0];
        const done = (lastArg instanceof Function) ? lastArg : noop;
        let startPath, startState;

        if (this.started) {
            done({ code: constants.ROUTER_ALREADY_STARTED });
            return this;
        }

        this._applyFunctions();
        this.started = true;
        this._invokeListeners('$start');
        const opts = this.options;

        if (args.length > 0) {
            if (typeof args[0] === 'string') startPath = args[0];
            if (typeof args[0] === 'object') startState = args[0];
        }

        // callback
        const cb = (err, state, invokeErrCb = true) => {
            if (!err) this._invokeListeners('$$success', state, null, {replace: true});
            if (err && invokeErrCb) this._invokeListeners('$$error', state, null, err);
            done(err, state);
        };

        // Get start path
        if (startPath === undefined && startState === undefined && this.getLocation) {
            startPath = this.getLocation();
        }

        if (!startState) {
            // If no supplied start state, get start state
            startState = startPath === undefined ? null : this.matchPath(startPath);
            // Navigate to default function
            const navigateToDefault = () => this.navigate(opts.defaultRoute, opts.defaultParams, {replace: true}, done);
            const redirect = (route) => this.navigate(route.name, route.params, {replace: true, reload: true}, done);
            // If matched start path
            if (startState) {
                this.lastStateAttempt = startState;
                this._transition(this.lastStateAttempt, this.lastKnownState, {}, (err, state) => {
                    if (!err) cb(null, state);
                    else if (err.redirect) redirect(err.redirect);
                    else if (opts.defaultRoute) navigateToDefault();
                    else cb(err, null, false);
                });
            } else if (opts.defaultRoute) {
                // If default, navigate to default
                navigateToDefault();
            } else {
                // No start match, no default => do nothing
                cb({ code: constants.ROUTE_NOT_FOUND, path: startPath }, null);
            }
        } else {
            // Initialise router with provided start state
            this.lastKnownState = startState;
            done(null, startState);
        }

        return this;
    }

    /**
     * Stop the router
     * @return {Router5} The router instance
     */
    stop() {
        if (!this.started) return this;
        this.lastKnownState = null;
        this.lastStateAttempt = null;
        this.started = false;
        this._invokeListeners('$stop');

        return this;
    }

    /**
     * Return the current state object
     * @return {Object} The current state
     */
    getState() {
        return this.lastKnownState;
    }

    /**
     * Whether or not the given route name with specified params is active.
     * @param  {String}   name             The route name
     * @param  {Object}   [params={}]      The route parameters
     * @param  {Boolean}  [strictEquality=false] If set to false (default), isActive will return true
     *                                           if the provided route name and params are descendants
     *                                           of the active state.
     * @param  {Boolean}   [ignoreQueryParams=true] Whether or not to ignore URL query parameters when
     *                                              comparing the two states together.
     *                                              query parameters when comparing two states together.
     * @return {Boolean}                    Whether nor not the route is active
     */
    isActive(name, params = {}, strictEquality = false, ignoreQueryParams = true) {
        const activeState = this.getState();

        if (!activeState) return false;

        if (strictEquality || activeState.name === name) {
            return this.areStatesEqual(makeState(name, params), activeState, ignoreQueryParams);
        }

        return this.areStatesDescendants(makeState(name, params), activeState);
    }

    /**
     * @private
     */
    areStatesEqual(state1, state2, ignoreQueryParams = true) {
        if (state1.name !== state2.name) return false;

        const getUrlParams = name => this.rootNode
            .getSegmentsByName(name)
            .map(segment => segment.parser[ignoreQueryParams ? 'urlParams' : 'params'])
            .reduce((params, p) => params.concat(p), []);

        const state1Params = getUrlParams(state1.name);
        const state2Params = getUrlParams(state2.name);

        return state1Params.length === state2Params.length && state1Params.every(p => state1.params[p] === state2.params[p]);
    }

    /**
     * Whether two states are descendants
     * @param  {Object} parentState The parent state
     * @param  {Object} childState  The child state
     * @return {Boolean}            Whether the two provided states are related
     */
    areStatesDescendants(parentState, childState) {
        const regex = new RegExp('^' + parentState.name + '\\.(.*)$');
        if (!regex.test(childState.name)) return false;
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(p => parentState.params[p] === childState.params[p]);
    }


    /**
     * @private
     */
    _invokeListeners(name, ...args) {
        (this._cbs[name] || []).forEach(cb => cb(...args));
    }

    /**
     * @private
     */
    _addListener(name, cb) {
        this._cbs[name] = (this._cbs[name] || []).concat(cb);
        return this;
    }

    /**
     * A function to determine whether or not a segment can be deactivated.
     * @param  {String}  name          The route segment full name
     * @param  {Boolean} canDeactivate Whether the segment can be deactivated or not
     * @return {[type]}
     */
    canDeactivate(name, canDeactivate) {
        this._canDeact[name] = toFunction(canDeactivate);
        // Allow dynamic setting of canDeactivate
        if (this.started) {
            this.__canDeact[name] = this._canDeact[name](...this._getDI());
        }
        return this;
    }

    /**
     * A function to determine whether or not a segment can be activated.
     * @param  {String}   name        The route name to register the canActivate method for
     * @param  {Function} canActivate The canActivate function. It should return `true`, `false`
     *                                or a promise
     * @return {Router5}  The router instance
     */
    canActivate(name, canActivate) {
        this._canAct[name] = toFunction(canActivate);
        // Allow dynamic setting of canActivate
        if (this.started) {
            this.__canAct[name] = this._canAct[name](...this._getDI());
        }
        return this;
    }

    /**
     * Generates an URL from a route name and route params.
     * The generated URL will be prefixed by hash if useHash is set to true
     * @param  {String} route  The route name
     * @param  {Object} params The route params (key-value pairs)
     * @return {String}        The built URL
     */
    buildUrl(route, params) {
        return this._buildUrl(this.buildPath(route, params));
    }

    /**
     * @private
     */
    _buildUrl(path) {
        return (this.options.base || '') +
            (this.options.useHash ? '#' + this.options.hashPrefix : '') +
            path;
    }

    /**
     * Build a path from a route name and route params
     * The generated URL will be prefixed by hash if useHash is set to true
     * @param  {String} route  The route name
     * @param  {Object} params The route params (key-value pairs)
     * @return {String}        The built Path
     */
    buildPath(route, params) {
        return this.rootNode.buildPath(route, params);
    }

    /**
     * Build a state object from a route name and route params
     * @param  {String} route  The route name
     * @param  {Object} params The route params (key-value pairs)
     * @return {String}        The built Path
     */
    buildState(route, params) {
        return this.rootNode.buildState(route, params);
    }

    /**
     * Match a path against the route tree.
     * @param  {String} path   The path to match
     * @return {Object}        The matched state object (null if no match)
     */
    matchPath(path) {
        const { trailingSlash, strictQueryParams } = this.options;
        const match = this.rootNode.matchPath(path, { trailingSlash, strictQueryParams });
        return match ? makeState(match.name, match.params, path, match._meta) : null;
    }

    /**
     * Parse / extract a path from an url
     * @param  {String} url The URL
     * @return {String}     The extracted path
     */
    urlToPath(url) {
        const match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
        const path = match ? match[1] : url;

        const pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);

        if (!pathParts) throw new Error(`[router5] Could not parse url ${url}`);

        const pathname = pathParts[1];
        const hash     = pathParts[2] || '';
        const search   = pathParts[3] || '';
        const opts = this.options;

        return (
            opts.useHash
            ? hash.replace(new RegExp('^#' + opts.hashPrefix), '')
            : (opts.base ? pathname.replace(new RegExp('^' + opts.base), '') : pathname)
        ) + search;
    }

    /**
     * Parse path from an url and match it against the route tree.
     * @param  {String} url    The URL to match
     * @return {Object}        The matched state object (null if no match)
     */
    matchUrl(url) {
        return this.matchPath(this.urlToPath(url));
    }

    /**
     * @private
     */
    _transition(toState, fromState, options = {}, done = noop) {
        // Cancel current transition
        this.cancel();
        this._invokeListeners('$$start', toState, fromState);

        const tr = transition(this, toState, fromState, options, (err, state) => {
            state = state || toState;
            this._tr = null;

            if (err) {
                if (err.code === constants.TRANSITION_CANCELLED) this._invokeListeners('$$cancel', toState, fromState);
                else this._invokeListeners('$$error', toState, fromState, err);

                done(err);
                return;
            }

            this.lastKnownState = state; // toState or modified state?

            done(null, state);
        });

        this._tr = tr;
        return () => !tr || tr();
    }

    /**
     * Undocumented for now
     * @private
     */
    cancel() {
        if (this._tr) this._tr();
    }

    /**
     * Navigate to a specific route
     * @param  {String}   name        The route name
     * @param  {Object}   [params={}] The route params
     * @param  {Object}   [opts={}]   The route options (replace, reload)
     * @param  {Function} done        A optional callback(err) to call when transition has been performed
     *                                either successfully or unsuccessfully.
     * @return {Function}             A cancellation function
     */
    navigate(name, params = {}, opts = {}, done = noop) {
        if (!this.started) {
            done({ code: constants.ROUTER_NOT_STARTED });
            return;
        }

        const toState = this.buildState(name, params);

        if (!toState) {
            const err = { code: constants.ROUTE_NOT_FOUND };
            done(err);
            this._invokeListeners('$$error', null, this.lastKnownState, err);
            return;
        }

        toState.path = this.buildPath(name, params);
        this.lastStateAttempt = toState;
        const sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt, false) : false;

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) {
            const err = { code: constants.SAME_STATES };
            done(err);
            this._invokeListeners('$$error', toState, this.lastKnownState, err);
            return;
        }

        const fromState = sameStates ? null : this.lastKnownState;

        // Transition and amend history
        return this._transition(toState, sameStates ? null : this.lastKnownState, opts, (err, state) => {
            if (err) {
                if (err.redirect) this.navigate(err.redirect.name, err.redirect.params, { reload: true }, done);
                else done(err);
                return;
            }

            this._invokeListeners('$$success', state, fromState, opts);
            done(null, state);
        });
    }
}

export default Router5;
