import RouteNode  from 'route-node/modules/RouteNode'
import transition from './transition'
import constants  from './constants'

let makeState = (name, params, path) => ({name, params, path})

/**
 * Create a new Router5 instance
 * @class
 * @param {RouteNode[]|Object[]|RouteNode|Object} routes The router routes
 * @param {Object} [opts={}] The router options: useHash, defaultRoute and defaultParams can be specified.
 * @return {Router5} The router instance
 */
export default class Router5 {
    constructor(routes, opts = {}) {
        this.started = false
        this._cbs = {}
        this._cmps = {}
        this._canAct = {}
        this.lastStateAttempt = null
        this.lastKnownState = null
        this.rootNode  = routes instanceof RouteNode ? routes : new RouteNode('', '', routes)
        this.options = {
            useHash: false,
            hashPrefix: ''
        }
        Object.keys(opts).forEach(opt => this.options[opt] = opts[opt])
        this.base = window.location.pathname.replace(/\/$/, '')

        return this
    }

    /**
     * Set an option value
     * @param  {String} opt The option to set
     * @param  {*}      val The option value
     * @return {Router5}    The Router5 instance
     */
    setOption(opt, val) {
        this.options[opt] = val
        return this
    }

    /**
     * Add route(s)
     * @param  {RouteNode[]|Object[]|RouteNode|Object} routes Route(s) to add
     * @return {Router5}  The Router5 instance
     */
    add(routes) {
        this.rootNode.add(routes)
        return this
    }

    /**
     * Add a route to the router.
     * @param {String}   name        The route name
     * @param {String}   path        The route path
     * @param {Function} canActivate A function to determine if the route can be activated.
     *                               It will be invoked during a transition with `toState`
     *                               and `fromState` parameters.
     * @return {Router5}             The Router5 instance
     */
    addNode(name, path, canActivate) {
        this.rootNode.addNode(name, path)
        if (canActivate) this._canAct[name] = canActivate
        return this
    }

    /**
     * @private
     */
    onPopState(evt) {
        // Do nothing if no state or if last know state is poped state (it should never happen)
        let state = evt.state || this.matchPath(this.getLocation())
        if (!state) return
        if (this.lastKnownState && this.areStatesEqual(state, this.lastKnownState)) return

        this._transition(state, this.lastKnownState, (err) => {
            if (!err) {
                let url = this.buildUrl(this.lastKnownState.name, this.lastKnownState.params)
                window.history.pushState(this.lastKnownState, '', url)
            }
        })
    }

    /**
     * Start the router
     * @param  {Function} done An optional callback which will be called when starting is done
     * @return {Router5}  The router instance
     */
    start(done) {
        if (this.started) return this
            this.started = true
        let opts = this.options

        // Try to match starting path name
        let startPath = this.getLocation();
        let startState = this.matchPath(startPath)

        let cb = (err) => {
            window.addEventListener('popstate', this.onPopState.bind(this))
            if (done) done(err)
        }

        let navigateToDefault = () => this.navigate(opts.defaultRoute, opts.defaultParams, {replace: true}, cb)

        if (startState) {
            this.lastStateAttempt = startState
            this._transition(this.lastStateAttempt, this.lastKnownState, (err) => {
                if (!err) {
                    window.history.replaceState(this.lastKnownState, '', this.buildUrl(startState.name, startState.params))
                    cb(null)
                }
                else if (opts.defaultRoute) navigateToDefault()
                else cb(err)
            })
        } else if (opts.defaultRoute) {
            navigateToDefault()
        } else {
            cb()
        }
        // Listen to popstate
        return this
    }

    /**
     * Stop the router
     * @return {Router5} The router instance
     */
    stop() {
        if (!this.started) return this
        this.started = false

        window.removeEventListener('popstate', this.onPopState.bind(this))
        return this
    }

    /**
     * Return the current state object
     * @return {Object} The current state
     */
    getState() {
        return this.lastKnownState
        // return window.history.state
    }

    /**
     * Whether or not the given route name with specified params is active.
     * @param  {String}   name             The route name
     * @param  {Object}   [params={}]      The route parameters
     * @param  {Boolean}  [equality=false] If set to false (default), isActive will return true
     *                                     if the provided route name and params are descendants
     *                                     of the active state.
     * @return {Boolean}                   Whether nor not the route is active
     */
    isActive(name, params = {}, strictEquality = false) {
        let activeState = this.getState()

        if (!activeState) return false

        if (strictEquality || activeState.name === name) {
            return this.areStatesEqual(makeState(name, params), activeState)
        }

        return this.areStatesDescendants(makeState(name, params), activeState)
    }

    /**
     * @private
     */
    areStatesEqual(state1, state2) {
        return state1.name === state2.name &&
           Object.keys(state1.params).length === Object.keys(state2.params).length &&
           Object.keys(state1.params).every(p => state1.params[p] === state2.params[p])
    }

    /**
     * Whether two states are descendants
     * @param  {Object} parentState The parent state
     * @param  {Object} childState  The child state
     * @return {Boolean}            Whether the two provided states are related
     */
    areStatesDescendants(parentState, childState) {
        let regex = new RegExp('^' + parentState.name + '\\.(.*)$')
        if (!regex.test(childState.name)) return false
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(p => parentState.params[p] === childState.params[p])
    }


    /**
     * @private
     */
    _invokeListeners(name, newState, oldState) {
        (this._cbs[name] || []).forEach(cb => cb(newState, oldState))
    }

    /**
     * @private
     */
    _addListener(name, cb, replace) {
        let normalizedName = name.replace(/^(\*|\^|=)/, '')
        if (normalizedName) {
            let segments = this.rootNode.getSegmentsByName(normalizedName)
            if (!segments) console.warn(`No route found for ${normalizedName}, listener might never be called!`)
        }
        if (!this._cbs[name]) this._cbs[name] = []
        this._cbs[name] = (replace ? [] : this._cbs[name]).concat(cb)
        return this
    }

    /**
     * @private
     */
    _removeListener(name, cb) {
        if (this._cbs[name]) this._cbs[name] = this._cbs[name].filter(callback => callback !== cb)
        return this
    }

    /**
     * Add a route change listener
     * @param {Function} cb The listener to add
     * @return {Router5} The router instance
     */
    addListener(cb) {
        return this._addListener('*', cb)
    }

    /**
     * Remove a route change listener
     * @param  {Function} cb The listener to remove
     * @return {Router5} The router instance
     */
    removeListener(cb) {
        return this._removeListener('*', cb)
    }

    /**
     * Add a node change listener
     * @param {String}   name The route segment full name
     * @param {Function} cb   The listener to add
     * @return {Router5} The router instance
     */
    addNodeListener(name, cb) {
        return this._addListener('^' + name, cb, true);
    }

    /**
     * Remove a node change listener
     * @param {String}   name The route segment full name
     * @param {Function} cb   The listener to remove
     * @return {Router5} The router instance
     */
    removeNodeListener(name, cb) {
        this._cbs['^' + name] = [];
        return this
    }

    /**
     * Add a route change listener
     * @param {String}   name The route name to listen to
     * @param {Function} cb   The listener to add
     * @return {Router5} The router instance
     */
    addRouteListener(name, cb) {
        return this._addListener('=' + name, cb)
    }

    /**
     * Remove a route change listener
     * @param {String}   name The route name to listen to
     * @param {Function} cb   The listener to remove
     * @return {Router5} The router instance
     */
    removeRouteListener(name, cb) {
        return this._removeListener('=' + name, cb)
    }

    /**
     * Register an active component for a specific route segment
     * @param  {String} name      The route segment full name
     * @param  {Object} component The component instance
     */
    registerComponent(name, component) {
        if (this._cmps[name]) console.warn(`A component was alread registered for route node ${name}.`)
        this._cmps[name] = component
        return this
    }

    /**
     * Deregister an active component
     * @param  {String} name The route segment full name
     * @return {Router5} The router instance
     */
    deregisterComponent(name) {
        delete this._cmps[name]
    }

    /**
     * [registerCanActivate description]
     * @param  {String}   name        The route name to register the canActivate method for
     * @param  {Function} canActivate The canActivate function. It should return `true`, `false`
     *                                or a promise
     * @return {Router5}  The router instance
     */
    canActivate(name, canActivate) {
        this._canAct[name] = canActivate
        return this
    }

    /**
     * @private
     */
    getLocation() {
        let path = this.options.useHash
            ? window.location.hash.replace(new RegExp('^#' + this.options.hashPrefix), '')
            : window.location.pathname.replace(new RegExp('^' + this.base), '')
        return path + window.location.search;
    }

    /**
     * Generates an URL from a route name and route params.
     * The generated URL will be prefixed by hash if useHash is set to true
     * @param  {String} route  The route name
     * @param  {Object} params The route params (key-value pairs)
     * @return {String}        The built URL
     */
    buildUrl(route, params) {
        return (this.options.useHash ? window.location.pathname + '#' + this.options.hashPrefix : this.base) +
            this.rootNode.buildPath(route, params)
    }

    /**
     * Build a path from a route name and route params
     * The generated URL will be prefixed by hash if useHash is set to true
     * @param  {String} route  The route name
     * @param  {Object} params The route params (key-value pairs)
     * @return {String}        The built Path
     */
    buildPath(route, params) {
        return this.rootNode.buildPath(route, params)
    }

    /**
     * Match a path against the route tree.
     * @param  {String} path   The path / URL to match
     * @return {Object}        The matched state object (null if no match)
     */
    matchPath(path) {
        let match = this.rootNode.matchPath(path)
        return match ? makeState(match.name, match.params, path) : null
    }

    /**
     * @private
     */
    _transition(toState, fromState, done) {
        // Cancel current transition
        if (this._tr) this._tr()

        let tr = transition(this, toState, fromState, (err) => {
            this._tr = null

            if (err) {
                if (done) done(err)
                return
            }

            this.lastKnownState = toState
            this._invokeListeners('=' + toState.name, toState, fromState)
            this._invokeListeners('*', toState, fromState)

            if (done) done(null, true)
        })

        this._tr = tr
        return () => !tr || tr()
    }

    /**
     * Navigate to a specific route
     * @param  {String}   name        The route name
     * @param  {Object}   [params={}] The route params
     * @param  {Object}   [opts={}]   The route options (replace, reload)
     * @param  {Function} done        A optional callback (err, res) to call when transition has been performed
     *                                either successfully or unsuccessfully.
     * @return {Function}             A cancellation function
     */
    navigate(name, params = {}, opts = {}, done) {
        if (!this.started) {
            done(constants.ROUTER_NOT_STARTED)
            return
        }

        let path  = this.buildPath(name, params)
        let url  = this.buildUrl(name, params)

        if (!path) throw new Error(`Could not find route "${name}"`)

        this.lastStateAttempt = makeState(name, params, path)
        let sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) {
            if (done) done(constants.SAME_STATES)
            return
        }

        // Transition and amend history
        return this._transition(this.lastStateAttempt, this.lastKnownState, (err) => {
            if (err) {
                if (done) done(err)
                return
            }

            window.history[opts.replace ? 'replaceState' : 'pushState'](this.lastStateAttempt, '', url)
            if (done) done(null, true)
        })
    }
}
