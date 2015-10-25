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
    const done = (err, state) => {
        if (!err && !isCancelled() && router.options.autoCleanUp) {
            const activeSegments = nameToIDs(toState.name);
            Object.keys(router._cmps).filter(name => {
                if (activeSegments.indexOf(name) === -1) router.deregisterComponent(name);
            });
        }
        callback(isCancelled() ? { code: constants.TRANSITION_CANCELLED } : err, state || toState);
    };

    const {toDeactivate, toActivate} = transitionPath(toState, fromState);

    const canDeactivate = (toState, fromState, cb) => {
        let canDeactivateFunctionMap = toDeactivate
            .filter(name => router._cmps[name] && router._cmps[name].canDeactivate)
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router._cmps[name].canDeactivate }), {});

        asyncProcess(
            canDeactivateFunctionMap, { isCancelled, toState, fromState },
            err => cb(err ? { code: constants.CANNOT_DEACTIVATE, segment: err } : null)
        );
    };

    const canActivate = (toState, fromState, cb) => {
        const canActivateFunctionMap = toActivate
            .filter(name => router._canAct[name])
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router._canAct[name] }), {});

        asyncProcess(
            canActivateFunctionMap, { isCancelled, toState, fromState },
            err => cb(err ? { code: constants.CANNOT_ACTIVATE, segment: err } : null)
        );
    };

    const middlewareFn = router.mware;
    const middleware = (toState, fromState, cb) => {
        let mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

        asyncProcess(
            mwareFunction, { isCancelled, toState, fromState, context: { cancel, router } },
            (err, state) => {
                const errObj = err ? (typeof err === 'object' ? err : { error: err }) : null;
                cb(err ? { code: constants.TRANSITION_ERR, ...errObj } : null, state || toState);
            }
        );
    };

    let pipeline = (fromState ? [canDeactivate] : [])
        .concat(canActivate)
        .concat(middlewareFn ? middleware : []);

    asyncProcess(pipeline, { isCancelled, toState, fromState }, done);

    return cancel;
}
