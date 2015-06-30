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

export default class Router5 {
    constructor(routes) {
        this.callbacks = []
        this.lastStateAttempt = null
        this.lastKnownState = null
        this.rootNode  = routes instanceof RouteNode ? routes : new RouteNode('', '', routes)
        this.activeComponents = {}

        window.addEventListener('popstate', evt => {
            this.lastStateAttempt = evt.state
            this._invokeCallbacks(evt.state, this.lastKnownState)
        })
    }

    _invokeCallbacks(newState, oldState) {
        this.callbacks.forEach(cb => {
            cb.call(this, newState, oldState)
        })
    }

    addListener(cb) {
        this.callbacks.push(cb)
    }

    removeListener(cb) {
        this.callbacks = this.callbacks.filter(callback => callback !== cb)
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

        this.lastStateAttempt = {name, path, params}
        let sameStates = this.lastKnownState ? areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) return

        if (this.lastKnownState && !sameStates) {
            let i
            // Diff segments
            let segmentIds = nameToIDs(name)
            let activeSegmentIds = nameToIDs(this.lastKnownState.name)
            let maxI = Math.min(segmentIds.length, activeSegmentIds.length)
            for (i = 0; i < maxI; i += 1) {
                if (activeSegmentIds[i] !== segmentIds[i]) break
            }
            let segmentsToDeactivate = activeSegmentIds.slice(i)
            console.log("to deactivate: ", segmentsToDeactivate)
        }
        // Push to history
        if (!sameStates) {
            window.history[opts.replace ? 'replaceState' : 'pushState'](this.lastStateAttempt, '', path)
        }
        // Update lastKnowState
        this._invokeCallbacks(this.lastStateAttempt, this.lastKnownState)

        this.lastKnownState = this.lastStateAttempt
    }
}
