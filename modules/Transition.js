let nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        ids.push(ids.length ? ids[ids.length - 1] + '.' + name : name)
        return ids
    }, [])
}

let boolToPromise = res => {
    if res.then return res
    return new Promise((resolve, reject) => res ? resolve() : reject())
}

let processFn = (fn, fromState, toState) => {
    return new Promise((resolve, reject) => {
        return boolToPromise(fn(toState, fromState))
    })
}

let process = (functions, fromState, toState) => {
    if (functions.length) {
        return processFn(functions[0], fromState, toState)
            .then(() => {
                return process(functions.slice(1), fromState, toState)
            })
    }
    return boolToPromise(true)
}

export default class Transition {
    constructor(router, fromState, toState) {
        let i
        let fromStateIds = fromState ? nameToIDs(fromState.name) : []
        let toStateIds = nameToIDs(toState.name)
        let maxI = Math.min(fromStateIds.length, toStateIds.length)

        for (i = 0; i < maxI; i += 1) {
            if (fromStateIds[i] !== toStateIds[i]) break
        }

        this.toState      = toState
        this.fromState    = fromState
        this.toDeactivate = fromStateIds.slice(i).reverse()
        this.toActivate   = toStateIds.slice(i)

        return new Promise((resolveTransition, rejectTransition) => {
            this.cancel = rejectTransition

            // Deactivate
            let canDeactivateFunctions = this.toDeactivate
                .map(name => router._cmps(name))
                .filter(comp => comp && comp.canDeactivate)
                .map(comp => comp.canDeactivate)

            let deactivation = process(canDeactivateFunctions, this.fromState, this.toState)

            // Activate
            let activation = deactivation.then(() => {
                let canActivateFunctions = this.toActivate
                    .map(name => router._canAct[name])
                    .filter(_ => _)

                return process(canActivateFunctions, this.fromState, this.toState)
            })

            activation.then(resolveTransition, rejectTransition)
        });
    }
}
