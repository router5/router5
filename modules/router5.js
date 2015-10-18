import RouteNode  from 'route-node';
import {transition, transitionPath} from './transition';
import constants  from './constants';
import browser    from './browser';

let makeState = (name, params, path) => ({name, params, path});

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
        this._onTr = null;
        this._cbs = {};
        this._cmps = {};
        this._canAct = {};
        this.lastStateAttempt = null;
        this.lastKnownState = null;
        this.rootNode  = routes instanceof RouteNode ? routes : new RouteNode('', '', routes);
        this.options = {
            useHash: false,
            hashPrefix: '',
            base: '',
            trailingSlash: 0
        };
        Object.keys(opts).forEach(opt => this.options[opt] = opts[opt]);
        this._setBase();
        this.registeredPlugins = {};
        // Bind onPopState
        this.boundOnPopState = this.onPopState.bind(this);
    }

    /**
     * @private
     */
    _setBase() {
        if (this.options.useHash && !this.options.base) this.options.base = browser.getBase();
    }

    /**
     * Set an option value
     * @param  {String} opt The option to set
     * @param  {*}      val The option value
     * @return {Router5}    The Router5 instance
     */
    setOption(opt, val) {
        this.options[opt] = val;
        if (opt === 'useHash') this._setBase();
        return this;
    }

    /**
     * Add route(s)
     * @param  {RouteNode[]|Object[]|RouteNode|Object} routes Route(s) to add
     * @return {Router5}  The Router5 instance
     */
    add(routes) {
        this.rootNode.add(routes);
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
        if (canActivate) this._canAct[name] = canActivate;
        return this;
    }

    usePlugin(plugin) {
        if (!plugin.name) console.warn('[router5.registerPlugin(plugin)] Missing property pluginName');

        const pluginMethods = ['onStart', 'onStop', 'onTransitionStart', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];
        const defined = pluginMethods.concat('init').some(method => plugin[method] !== undefined);

        if (!defined) throw new Error(`[router5] plugin ${plugin.name} has none of the expected methods implemented`);
        this.registeredPlugins[plugin.name] = plugin;

        if (plugin.init) plugin.init(this);

        pluginMethods.forEach(method => {
            if (plugin[method]) {
                this._addListener(method.toLowerCase().replace(/^on/, '$'), plugin[method]);
            }

        });
        return this;
    }

    /**
     * @private
     */
    onPopState(evt) {
        // Do nothing if no state or if last know state is poped state (it should never happen)
        let newState = !evt.state || !evt.state.name;
        let state = evt.state || this.matchPath(this.getLocation());
        let opts = this.options;

        if (!state) {
            // If current state is already the default route, we will have a double entry
            // Navigating back and forth will emit SAME_STATES error
            this.navigate(opts.defaultRoute, opts.defaultParams, {reload: true, replace: true});
            return;
        }
        if (this.lastKnownState && this.areStatesEqual(state, this.lastKnownState)) {
            return;
        }

        this._transition(state, this.lastKnownState, (err, toState) => {
            if (err) {
                if (err === constants.CANNOT_DEACTIVATE) {
                    let url = this.buildUrl(this.lastKnownState.name, this.lastKnownState.params);
                    if (!newState) {
                        // Keep history state unchanged but use current URL
                        this.updateBrowserState(state, url, true);
                    }
                    // else do nothing or history will be messed up
                    // TODO: history.back()?
                } else {
                    // Force navigation to default state
                    this.navigate(opts.defaultRoute, opts.defaultParams, {reload: true, replace: true});
                }
            } else {
                this.updateBrowserState(toState, this.buildUrl(toState.name, toState.params), newState);
            }
        })
    }

    /**
     * Set a transition middleware function
     * @param {Function} fn The middleware function
     */
    onTransition(fn) {
        this._onTr = fn;
        return this;
    }

    /**
     * Start the router
     * @param  {String|Object} [startPathOrState] An optional start path or state
     *                                            (use it for universal applications)
     * @param  {Function}      [done]             An optional callback which will be called
     *                                            when starting is done
     * @return {Router5}  The router instance
     */
    start() {
        let args = Array.prototype.slice.call(arguments);
        let lastArg = args.slice(-1)[0];
        let done = (lastArg instanceof Function) ? lastArg : null;
        let startPath, startState;

        if (this.started) {
            if (done) done(constants.ROUTER_ALREADY_STARTED);
            return this;
        }

        if (args.length > 0) {
            if (typeof args[0] === 'string') startPath = args[0];
            if (typeof args[0] === 'object') startState = args[0];
        }

        this.started = true;
        this._invokeListeners('$start');
        let opts = this.options;

        // callback
        let cb = (err, state, invokeErrCb = true) => {
            browser.addPopstateListener(this.boundOnPopState);
            if (done) done(err, state);
            if (err && invokeErrCb) this._invokeListeners('$transitionerror', state, null, err);
        }

        // Get start path
        if (!startPath && !startState) startPath = this.getLocation();

        if (!startState) {
            // If no supplied start state, get start state
            startState = this.matchPath(startPath);
            // Navigate to default function
            let navigateToDefault = () => this.navigate(opts.defaultRoute, opts.defaultParams, {replace: true}, (err, state) => cb(err, state, false));
            // If matched start path
            if (startState) {
                this.lastStateAttempt = startState;
                this._transition(this.lastStateAttempt, this.lastKnownState, (err, state) => {
                    if (!err) {
                        this.updateBrowserState(this.lastKnownState, this.buildUrl(startState.name, startState.params), true);
                        cb(null, state);
                    }
                    else if (opts.defaultRoute) navigateToDefault();
                    else cb(err, null, false);
                })
            } else if (opts.defaultRoute) {
                // If default, navigate to default
                navigateToDefault();
            } else {
                // No start match, no default => do nothing
                cb(constants.ROUTE_NOT_FOUND, null);
            }
        } else {
            // Initialise router with provided start state
            this.lastKnownState = startState
            this.updateBrowserState(this.lastKnownState, this.buildUrl(startState.name, startState.params), true);
            cb(null, startState);
        }
        // Listen to popstate
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

        browser.removePopstateListener(this.boundOnPopState);
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
        let activeState = this.getState()

        if (!activeState) return false

        if (strictEquality || activeState.name === name) {
            return this.areStatesEqual(makeState(name, params), activeState, ignoreQueryParams)
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
        let regex = new RegExp('^' + parentState.name + '\\.(.*)$');
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
    _addListener(name, cb, replace) {
        this._cbs[name] = (this._cbs[name] || []).concat(cb);
        return this;
    }

    /**
     * Register an active component for a specific route segment
     * @param  {String} name      The route segment full name
     * @param  {Object} component The component instance
     */
    registerComponent(name, component) {
        if (this._cmps[name]) console.warn(`A component was alread registered for route node ${name}.`);
        this._cmps[name] = component;
        return this;
    }

    /**
     * Deregister an active component
     * @param  {String} name The route segment full name
     * @return {Router5} The router instance
     */
    deregisterComponent(name) {
        delete this._cmps[name];
    }

    /**
     * A function to determine whether or not a segment can be activated.
     * @param  {String}   name        The route name to register the canActivate method for
     * @param  {Function} canActivate The canActivate function. It should return `true`, `false`
     *                                or a promise
     * @return {Router5}  The router instance
     */
    canActivate(name, canActivate) {
        this._canAct[name] = canActivate;
        return this;
    }

    /**
     * @private
     */
    getLocation() {
        return browser.getLocation(this.options);
    }

    /**
     * Generates an URL from a route name and route params.
     * The generated URL will be prefixed by hash if useHash is set to true
     * @param  {String} route  The route name
     * @param  {Object} params The route params (key-value pairs)
     * @return {String}        The built URL
     */
    buildUrl(route, params) {
        return this._buildUrl(this.rootNode.buildPath(route, params));
    }

    _buildUrl(path) {
        return this.options.base +
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
     * Match a path against the route tree.
     * @param  {String} path   The path to match
     * @return {Object}        The matched state object (null if no match)
     */
    matchPath(path) {
        let match = this.rootNode.matchPath(path, this.options.trailingSlash);
        return match ? makeState(match.name, match.params, path) : null;
    }

    /**
     * Parse / extract a path from an url
     * @param  {String} url The URL
     * @return {String}     The extracted path
     */
    urlToPath(url) {
        let match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
        let path = match ? match[1] : url;

        let pathParts = path.match(/^(.*?)(#.*?)?(\?.*)?$/);

        if (!pathParts) throw new Error(`[router5] Could not parse url ${url}`);

        let [pathname, hash, search] = pathParts.slice(1);
        let opts = this.options;

        return (
            opts.useHash
            ? hash.replace(new RegExp('^#' + opts.hashPrefix), '')
            : pathname.replace(new RegExp('^' + opts.base), '')
        ) + (search || '');
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
    _transition(toState, fromState, done) {
        // Cancel current transition
        if (this._tr) this._tr()
        this._invokeListeners('$transitionstart', toState, fromState);

        let tr = transition(this, toState, fromState, (err) => {
            this._tr = null

            if (err) {
                if (err === constants.TRANSITION_CANCELLED) this._invokeListeners('$transitioncancel', toState, fromState);
                else this._invokeListeners('$transitionerror', toState, fromState, err);

                if (done) done(err);
                return
            }

            this.lastKnownState = toState;
            this._invokeListeners('$transitionsuccess', toState, fromState);

            if (done) done(null, toState);
        })

        this._tr = tr;
        return () => !tr || tr();
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
    navigate(name, params = {}, opts = {}, done) {
        if (!this.started) {
            if (done) done(constants.ROUTER_NOT_STARTED);
            return;
        }

        if (!browser.getState()) opts.replace = true;

        let path  = this.buildPath(name, params);
        let url  = this.buildUrl(name, params);

        if (!path) {
            if (done) done(constants.ROUTE_NOT_FOUND);
            this._invokeListeners('$transitionerror', null, this.lastKnownState, constants.ROUTE_NOT_FOUND);
            return
        }

        let toState = makeState(name, params, path);
        this.lastStateAttempt = toState;
        let sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false;

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) {
            if (done) done(constants.SAME_STATES);
            this._invokeListeners('$transitionerror', toState, this.lastKnownState, constants.SAME_STATES);
            return
        }

        // Transition and amend history
        return this._transition(toState, sameStates ? null : this.lastKnownState, (err, state) => {
            if (err) {
                if (done) done(err);
                return;
            }

            this.updateBrowserState(this.lastStateAttempt, url, opts.replace);
            if (done) done(null, state);
        })
    }

    /**
     * Update the browser history
     * @param {Object}  stateObject     State object to be used
     * @param {string}  url             Absolute url to be used
     * @param {boolean} [replace=false] If replaceState or pushState should be used
     * @param {string}  [title='']      The title to be used for history
     */
    updateBrowserState(stateObject, url, replace = false, title = '') {
        browser[replace ? 'replaceState' : 'pushState'](stateObject, title, url);
    }
}

/**
 * Error codes
 * @type {Object}
 */
Router5.ERR = constants;

/**
 * An helper function to return instructions for a transition:
 * intersection route name, route names to deactivate, route names to activate
 * @param  {Object} toState   The state to go to
 * @param  {Object} fromState The state to go from
 * @return {Object}           An object containing 'intersection', 'toActivate' and 'toDeactivate' keys
 */
Router5.transitionPath = transitionPath;

export default Router5;
