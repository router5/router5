import transitionPath from 'router5.transition-path';
import asyncProcess from './async';
import constants from './constants';

export default transition;

const nameToIDs = name => {
    return name.split('.').reduce((ids, name) => {
        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
    }, []);
};

function transition(router, toState, fromState, callback) {
    let cancelled = false;
    const additionalArgs = router.getAdditionalArgs();
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
    const asyncBase = { isCancelled, toState, fromState, additionalArgs: [] };

    const canDeactivate = (toState, fromState, cb) => {
        let canDeactivateFunctionMap = toDeactivate
            .filter(name => router._cmps[name] && router._cmps[name].canDeactivate)
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router._cmps[name].canDeactivate }), {});

        asyncProcess(
            canDeactivateFunctionMap, { ...asyncBase, additionalArgs },
            err => cb(err ? { code: constants.CANNOT_DEACTIVATE, segment: err } : null)
        );
    };

    const canActivate = (toState, fromState, cb) => {
        const canActivateFunctionMap = toActivate
            .filter(name => router._canAct[name])
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router._canAct[name] }), {});

        asyncProcess(
            canActivateFunctionMap, { ...asyncBase, additionalArgs },
            err => cb(err ? { code: constants.CANNOT_ACTIVATE, segment: err } : null)
        );
    };

    const middlewareFn = router.mware;
    const middleware = (toState, fromState, cb) => {
        let mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

        asyncProcess(
            mwareFunction, { ...asyncBase, context: { cancel, router } },
            (err, state) => {
                const errObj = err ? (typeof err === 'object' ? err : { error: err }) : null;
                cb(err ? { code: constants.TRANSITION_ERR, ...errObj } : null, state || toState);
            }
        );
    };

    let pipeline = (fromState ? [canDeactivate] : [])
        .concat(canActivate)
        .concat(middlewareFn ? middleware : []);

    asyncProcess(pipeline, asyncBase, done);

    return cancel;
}
