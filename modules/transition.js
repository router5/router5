import asyncProcess from './async';
import constants from './constants';

export default {transition, transitionPath};

const nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
    }, []);
};

function transitionPath(toState, fromState) {
    let i;
    const fromStateIds = fromState ? nameToIDs(fromState.name) : [];
    const toStateIds = nameToIDs(toState.name);
    const maxI = Math.min(fromStateIds.length, toStateIds.length);

    if (fromState && fromState.name === toState.name) i = Math.max(maxI - 1, 0);
    else {
        for (i = 0; i < maxI; i += 1) {
            if (fromStateIds[i] !== toStateIds[i]) break;
        }
    }

    const toDeactivate = fromStateIds.slice(i).reverse();
    const toActivate   = toStateIds.slice(i);
    const intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';

    return {intersection, toDeactivate, toActivate};
}

function transition(router, toState, fromState, callback) {
    let cancelled = false;
    const isCancelled = () => cancelled;
    const cancel = () => cancelled = true;
    const done = (err) => callback(isCancelled() ? constants.TRANSITION_CANCELLED : err);

    const {toDeactivate, toActivate} = transitionPath(toState, fromState);

    const canDeactivate = (toState, fromState, cb) => {
        let canDeactivateFunctions = toDeactivate
            .map(name => router._cmps[name])
            .filter(comp => comp && comp.canDeactivate)
            .map(comp => comp.canDeactivate);

        asyncProcess(
            isCancelled, canDeactivateFunctions, toState, fromState,
            err => cb(err ? constants.CANNOT_DEACTIVATE : null)
        );
    };

    const canActivate = (toState, fromState, cb) => {
        let canActivateFunctions = toActivate
            .map(name => router._canAct[name])
            .filter(_ => _);

        asyncProcess(
            isCancelled, canActivateFunctions, toState, fromState,
            err => cb(err ? constants.CANNOT_ACTIVATE : null)
        );
    };

    const middlewareFn = router.mware;
    const middleware = (toState, fromState, cb) => {
        let mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

        asyncProcess(
            isCancelled, mwareFunction, toState, fromState,
            err => cb(err ? constants.TRANSITION_ERR : null)
        );
    };

    const cleanNonActive = () => {
        if (router.options.autoCleanUp) {
            const activeSegments = nameToIDs(toState.name);
            Object.keys(router._cmps).filter(name => {
                if (name.indexOf(activeSegments) === -1) router.deregisterComponent(name);
            });
        }
        return true;
    };

    let pipeline = (fromState ? [canDeactivate] : [])
        .concat(canActivate)
        .concat(middlewareFn ? middleware : [])
        .concat(cleanNonActive);

    asyncProcess(isCancelled, pipeline, toState, fromState, done);

    return cancel;
}
