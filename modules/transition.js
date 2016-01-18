import transitionPath, { nameToIDs } from 'router5.transition-path';
import asyncProcess from './async';
import constants from './constants';

export default transition;

function transition(router, toState, fromState, callback) {
    let cancelled = false;
    const additionalArgs = router.getAdditionalArgs();
    const isCancelled = () => cancelled;
    const cancel = () => cancelled = true;
    const done = (err, state) => {
        if (!err && !isCancelled() && router.options.autoCleanUp) {
            const activeSegments = nameToIDs(toState.name);
            Object.keys(router._canDeact).forEach(name => {
                if (activeSegments.indexOf(name) === -1) router._canDeact[name] = undefined;
            });
        }
        callback(isCancelled() ? { code: constants.TRANSITION_CANCELLED } : err, state || toState);
    };

    const {toDeactivate, toActivate} = transitionPath(toState, fromState);
    const asyncBase = { isCancelled, toState, fromState, additionalArgs: [] };

    const canDeactivate = (toState, fromState, cb) => {
        let canDeactivateFunctionMap = toDeactivate
            .filter(name => router._canDeact[name])
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router._canDeact[name] }), {});

        asyncProcess(
            canDeactivateFunctionMap, { ...asyncBase, additionalArgs },
            err => {
                const errObj = err ? (err instanceof Error ? { error: err } : { segment: err }) : null;
                cb(err ? { code: constants.CANNOT_DEACTIVATE, ...errObj } : null);
            }
        );
    };

    const canActivate = (toState, fromState, cb) => {
        const canActivateFunctionMap = toActivate
            .filter(name => router._canAct[name])
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router._canAct[name] }), {});

        asyncProcess(
            canActivateFunctionMap, { ...asyncBase, additionalArgs },
            err => {
                const errObj = err ? (err instanceof Error ? { error: err } : { segment: err }) : null;
                cb(err ? { code: constants.CANNOT_ACTIVATE, ...errObj } : null);
            }
        );
    };

    const middlewareFn = router.mware;
    const middleware = (toState, fromState, cb) => {
        let mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

        asyncProcess(
            mwareFunction, { ...asyncBase, additionalArgs },
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
