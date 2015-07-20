let nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        ids.push(ids.length ? ids[ids.length - 1] + '.' + name : name)
        return ids
    }, [])
}

let boolToPromise = res => {
    if (res.then) return res
    return new Promise((resolve, reject) => res || res === undefined ? resolve() : reject())
}

let processFn = (fn, toState, fromState) => {
    return new Promise((resolve, reject) => {
        return boolToPromise(fn(toState, fromState))
    })
}

let process = (functions, toState, fromState) => {
    if (functions.length) {
        return processFn(functions[0], toState, fromState)
            .then(() => process(functions.slice(1), toState, fromState))
    }
    return boolToPromise(true)
}

export default class Transition {
    constructor(router, toState, fromState) {
        let i
        let fromStateIds = fromState ? nameToIDs(fromState.name) : []
        let toStateIds = nameToIDs(toState.name)
        let maxI = Math.min(fromStateIds.length, toStateIds.length)

        for (i = 0; i < maxI; i += 1) {
            if (fromStateIds[i] !== toStateIds[i]) break
        }
        let toDeactivate = fromStateIds.slice(i).reverse()
        let toActivate   = toStateIds.slice(i)
        let intersection = i > 0 ? fromStateIds[i - 1] : ''

        return new Promise((resolveTransition, rejectTransition) => {
            this.cancel = rejectTransition

            // Deactivate
            let canDeactivateFunctions = toDeactivate
                .map(name => router._cmps(name))
                .filter(comp => comp && comp.canDeactivate)
                .map(comp => comp.canDeactivate)

            let deactivation = process(canDeactivateFunctions, toState, fromState)

            // Activate
            let activation = deactivation.then(() => {
                let canActivateFunctions = toActivate
                    .map(name => router._canAct[name])
                    .filter(_ => _)
                return process(canActivateFunctions, toState, fromState)
            })

            // Node listener
            let nodeListener = activation.then(() => router._invokeListeners('^' + intersection, toState, fromState))

            nodeListener.then(resolveTransition, rejectTransition)
        });
    }
}
