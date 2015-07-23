import asyncProcess from './async'
import constants from './constants'

let nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name)
    }, [])
}

export default function transition(router, toState, fromState, callback) {
    let cancelled = false
    let cancel = () => cancelled = true
    let done = (err) => callback(cancelled ? constants.TRANSITION_CANCELLED : err)

    let i
    let fromStateIds = fromState ? nameToIDs(fromState.name) : []
    let toStateIds = nameToIDs(toState.name)
    let maxI = Math.min(fromStateIds.length, toStateIds.length)

    for (i = 0; i < maxI; i += 1) {
        if (fromStateIds[i] !== toStateIds[i]) break
    }

    let toDeactivate = fromStateIds.slice(i).reverse()
    let toActivate   = toStateIds.slice(i)
    let intersection = fromState ? (i > 0 ? fromStateIds[i - 1] : '') : null

    let canDeactivate = (toState, fromState, cb) => {
        if (cancelled) done()
        else {
            let canDeactivateFunctions = toDeactivate
                .map(name => router._cmps[name])
                .filter(comp => comp && comp.canDeactivate)
                .map(comp => comp.canDeactivate)

            asyncProcess(
                canDeactivateFunctions, toState, fromState,
                err => cb(err ? constants.CANNOT_DEACTIVATE : null)
            )
        }
    }

    let canActivate = (toState, fromState, cb) => {
        if (cancelled) done()
        else {
            let canActivateFunctions = toActivate
                .map(name => router._canAct[name])
                .filter(_ => _)

            asyncProcess(
                canActivateFunctions, toState, fromState,
                err => cb(err ? constants.CANNOT_ACTIVATE : null)
            )
        }
    }

    let nodeListener = (toState, fromState, cb) => {
        if (cancelled) done()
        else {
            let listeners = router._cbs['^' + intersection] || []
            asyncProcess(
                listeners, toState, fromState,
                err => cb(err ? constants.NODE_LISTENER_ERR : null),
                true
            )
        }
    }

    let pipeline = fromState ? [canDeactivate, canActivate, nodeListener] : [canActivate]
    asyncProcess(pipeline, toState, fromState, done)

    return cancel
}
