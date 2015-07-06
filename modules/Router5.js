import RouteNode from 'route-node/modules/RouteNode'

let nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        ids.push(ids.length ? ids[ids.length - 1] + '.' + name : name)
        return ids
    }, [])
}

let makeState = (name, params, path) => ({name, params, path})

export default class Router5 {
    constructor(routes, opts = {}) {
        this.started = false
        this.callbacks = {}
        this.lastStateAttempt = null
        this.lastKnownState = null
        this.rootNode  = routes instanceof RouteNode ? routes : new RouteNode('', '', routes)
        this.activeComponents = {}
        this.options = opts

        return this
    }

    setOption(opt, val) {
        this.options[opt] = val
        return this
    }

    add(routes) {
        this.rootNode.add(routes)
        return this
    }

    addNode(name, params) {
        this.rootNode.addNode(name, params)
        return this
    }

    onPopState(evt) {
        // Do nothing if no state or if last know state is poped state (it should never happen)
        let state = evt.state || this.matchPath(this.getWindowPath())
        if (!state) return
        if (this.lastKnownState && this.areStatesEqual(state, this.lastKnownState)) return

        let canTransition = this._transition(state, this.lastKnownState)
        if (!canTransition) window.history.pushState(this.lastKnownState, '', this.options.useHash ? `#${path}` : path)
    }

    start() {
        if (this.started) return this
        this.started = true

        // Try to match starting path name
        let startPath = this.getWindowPath();
        let startState = this.matchPath(startPath)

        if (startState) {
            this.lastKnownState = startState
            window.history.replaceState(this.lastKnownState, '', this.options.useHash ? `#${startPath}` : startPath)
        } else if (this.options.defaultRoute) {
            this.navigate(this.options.defaultRoute, this.options.defaultParams, {replace: true})
        }
        // Listen to popstate
        window.addEventListener('popstate', this.onPopState.bind(this))
        return this
    }

    stop() {
        if (!this.started) return this
        this.started = false

        window.removeEventListener('popstate', this.onPopState.bind(this))
        return this
    }

    _invokeCallbacks(name, newState, oldState) {
        if (!this.callbacks[name]) return
        this.callbacks[name].forEach(cb => {
            cb.call(this, newState, oldState)
        })
    }

    _transition(toState, fromState) {
        if (!fromState) {
            this.lastKnownState = toState
            this._invokeCallbacks('', toState, fromState)
            return true
        }

        let i
        let cannotDeactivate = false
        let fromStateIds = nameToIDs(fromState.name)
        let toStateIds   = nameToIDs(toState.name)
        let maxI = Math.min(fromStateIds.length, toStateIds.length)

        for (i = 0; i < maxI; i += 1) {
            if (fromStateIds[i] !== toStateIds[i]) break
        }

        cannotDeactivate =
            fromStateIds.slice(i).reverse()
                .map(id => this.activeComponents[id])
                .filter(comp => comp && comp.canDeactivate)
                .some(comp => !comp.canDeactivate(toState, fromState))


       if (!cannotDeactivate) {
            this.lastKnownState = toState
            this._invokeCallbacks(i > 0 ? '^' + fromStateIds[i - 1] : '^', toState, fromState)
            this._invokeCallbacks('=' + toState.name, toState, fromState)
            this._invokeCallbacks('', toState, fromState)
        }

        return !cannotDeactivate
    }

    getState() {
        return this.lastKnownState
        // return window.history.state
    }

    getWindowPath() {
        return this.options.useHash ? window.location.hash.replace(/^#/, '') : window.location.pathname
    }

    areStatesEqual(state1, state2) {
        return state1.name === state2.name &&
           Object.keys(state1.params).length === Object.keys(state2.params).length &&
           Object.keys(state1.params).every(p => state1.params[p] === state2.params[p])
    }

    registerComponent(name, component) {
        if (this.activeComponents[name]) console.warn(`A component was alread registered for route node ${name}.`)
        this.activeComponents[name] = component
    }

    deregisterComponent(name) {
        delete this.activeComponents[name]
    }

    _addListener(name, cb) {
        let normalizedName = name.replace(/^(\^|=)/, '')
        if (normalizedName) {
            let segments = this.rootNode.getSegmentsByName(normalizedName)
            if (!segments) console.warn(`No route found for ${normalizedName}, listener might never be called!`)
        }
        if (!this.callbacks[name]) this.callbacks[name] = []
        this.callbacks[name].push(cb)
    }

    _removeListener(name, cb) {
        if (!this.callbacks[name]) return
        this.callbacks[name] = this.callbacks[name].filter(callback => callback !== cb)
    }

    addListener(cb) {
        this._addListener('', cb)
    }

    removeListener(cb) {
        this._removeListener('', cb)
    }

    addNodeListener(name, cb) {
        this._addListener('^' + name, cb);
    }

    removeNodeListener(name, cb) {
        this._removeListener('^' + name, cb);
    }

    addRouteListener(name, cb) {
        this._addListener('=' + name, cb)
    }

    removeRouteListener(name, cb) {
        this._removeListener('=' + name, cb)
    }

    buildPath(route, params) {
        return (this.options.useHash ? '#' : '') + this.rootNode.buildPath(route, params)
    }

    matchPath(path) {
        let match = this.rootNode.matchPath(path)
        return match ? makeState(match.name, match.params, path) : null
    }

    navigate(name, params = {}, opts = {}) {
        if (!this.started) return

        let path  = this.rootNode.buildPath(name, params)

        if (!path) throw new Error(`Could not find route "${name}"`)

        this.lastStateAttempt = makeState(name, params, path)
        let sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) return

        // Transition and amend history
        let canTransition = this._transition(this.lastStateAttempt, this.lastKnownState)

        if (canTransition && !sameStates) {
            window.history[opts.replace ? 'replaceState' : 'pushState'](this.lastStateAttempt, '', this.options.useHash ? `#${path}` : path)
        }
    }
}
