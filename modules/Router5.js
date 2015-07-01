import RouteNode from 'route-node'

let nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        ids.push(ids.length ? ids[ids.length - 1] + '.' + name : name)
        return ids
    }, [])
}

let areStatesEqual = (state1, state2) => {
    return state1.name === state2.name &&
       Object.keys(state1.params).length === Object.keys(state2.params).length &&
       Object.keys(state1.params).every(p => state1.params[p] === state2.params[p])
}

let makeState = (name, params, path) => ({name, params, path})

export default class Router5 {
    constructor(routes, opts = {}) {
        this.callbacks = {}
        this.lastStateAttempt = null
        this.lastKnownState = null
        this.rootNode  = routes instanceof RouteNode ? routes : new RouteNode('', '', routes)
        this.activeComponents = {}
        this.options = opts

        // Try to match starting path name
        let startPath = opts.useHash ? window.location.hash.replace(/^#/, '') : window.location.pathname
        let startMatch = this.rootNode.matchPath(startPath)

        if (startMatch) {
            this.lastKnownState = makeState(startMatch.name, startMatch.params, startPath)
            window.history.replaceState(this.lastKnownState, '', opts.useHash ? `#${startPath}` : startPath)
        } else if (opts.defaultRoute) {
            this.navigate(opts.defaultRoute, opts.defaultParams, {replace: true})
        }

        window.addEventListener('popstate', evt => {
            // Do nothing if no state or if current = pop state (it should never happen)
            if (!evt.state) return
            if (this.lastKnownState && areStatesEqual(evt.state, this.lastKnownState)) return

            this._transition(evt.state, this.lastKnownState)
            this.lastKnownState = evt.state
        })
    }

    _invokeCallbacks(name, newState, oldState) {
        if (!this.callbacks[name]) return
        this.callbacks[name].forEach(cb => {
            cb.call(this, newState, oldState)
        })
    }

    _transition(toState, fromState) {
        if (fromState) {
            let i
            let fromStateIds = nameToIDs(fromState.name)
            let toStateIds   = nameToIDs(toState.name)

            let maxI = Math.min(fromStateIds.length, toStateIds.length)
            for (i = 0; i < maxI; i += 1) {
                if (fromStateIds[i] !== toStateIds[i]) break
            }

            let segmentsToDeactivate = fromStateIds.slice(i)
            console.info("to deactivate: ", segmentsToDeactivate)

            if (i > 0) {
                console.info("Render from node: ", fromStateIds[i - 1])
                this._invokeCallbacks(fromStateIds[i - 1], toState, fromState)
            }
        }

        this._invokeCallbacks('', toState, fromState)
    }

    getState() {
        return this.lastKnownState
    }

    registerComponent(name, component) {
        if (this.activeComponents[name]) console.warn(`A component was alread registered for route node ${name}.`)
        this.activeComponents[name] = component
    }

    deregisterComponent(name) {
        delete this.activeComponents[name]
    }

    addNodeListener(name, cb) {
        if (name) {
            let segments = this.rootNode.getSegmentsByName(name)
            if (!segments.length) console.warn(`No route found for ${name}, listener could be never called!`)
        }
        if (!this.callbacks[name]) this.callbacks[name] = []
        this.callbacks[name].push(cb)
    }

    removeNodeListener(name, cb) {
        if (!this.callbacks[name]) return
        this.callbacks[name] = this.callbacks[name].filter(callback => callback !== cb)
    }

    addListener(cb) {
        this.addNodeListener('', cb)
    }

    removeListener(cb) {
        this.removeNodeListener('', cb)
    }

    buildPath(route, params) {
        return this.rootNode.buildPath(route, params)
    }

    navigate(name, params = {}, opts = {}) {
        let currentState = window.history.state
        // let segments = this.rootNode.getSegmentsByName(name)
        // let path  = this.rootNode.buildPathFromSegments(segments, params)
        let path  = this.rootNode.buildPath(name, params)

        if (!path) throw new Error(`Could not find route "${name}"`)

        this.lastStateAttempt = makeState(name, params, path)
        let sameStates = this.lastKnownState ? areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) return
        // Transition and amend history
        if (!sameStates) {
            this._transition(this.lastStateAttempt, this.lastKnownState)
            window.history[opts.replace ? 'replaceState' : 'pushState'](this.lastStateAttempt, '', this.options.useHash ? `#${path}` : path)
        }

        // Update lastKnowState
        this.lastKnownState = this.lastStateAttempt
    }
}
