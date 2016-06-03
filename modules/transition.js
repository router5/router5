import transitionPath, { nameToIDs } from 'router5.transition-path';
import resolve from './resolve';
import constants from './constants';

export default transition;

function transition(router, toState, fromState, options, callback) {
    let cancelled = false;
    const isCancelled = () => cancelled;
    const cancel = () => cancelled = true;
    const done = (err, state) => {
        if (!err && !isCancelled() && router.options.autoCleanUp) {
            const activeSegments = nameToIDs(toState.name);
            Object.keys(router.__canDeact).forEach(name => {
                if (activeSegments.indexOf(name) === -1) router.__canDeact[name] = undefined;
            });
        }
        callback(isCancelled() ? { code: constants.TRANSITION_CANCELLED } : err, state || toState);
    };
    const makeError = (base, err) => ({
        ...base,
        ...(err instanceof Object ? err : { error: err })
    });

    const {toDeactivate, toActivate} = transitionPath(toState, fromState);
    const asyncBase = { isCancelled, toState, fromState };

    const canDeactivate = (toState, fromState, cb) => {
        let canDeactivateFunctionMap = toDeactivate
            .filter(name => router.__canDeact[name])
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router.__canDeact[name] }), {});

        resolve(
            canDeactivateFunctionMap, { ...asyncBase, errorKey: 'segment' },
            err => cb(err ? makeError({ code: constants.CANNOT_DEACTIVATE }, err) : null)
        );
    };

    const canActivate = (toState, fromState, cb) => {
        const canActivateFunctionMap = toActivate
            .filter(name => router.__canAct[name])
            .reduce((fnMap, name) => ({ ...fnMap, [name]: router.__canAct[name] }), {});

        resolve(
            canActivateFunctionMap, { ...asyncBase, errorKey: 'segment' },
            err => cb(err ? makeError({ code: constants.CANNOT_ACTIVATE }, err) : null)
        );
    };

    const middleware = !router.__mware.length ? [] :
        (toState, fromState, cb) =>
            resolve(
                router.__mware, { ...asyncBase },
                (err, state) => cb(
                    err ? makeError({ code: constants.TRANSITION_ERR }, err) : null,
                    state || toState
                )
            );

    let pipeline = (fromState && !options.forceDeactivate ? [canDeactivate] : [])
        .concat(canActivate)
        .concat(middleware);

    resolve(pipeline, asyncBase, done);

    return cancel;
}
