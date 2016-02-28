import transitionPath, { nameToIDs } from 'router5.transition-path';
import asyncProcess from './async';
import constants from './constants';

export default transition;

function transition(router, toState, fromState, options, callback) {
    var cancelled = false;
    var additionalArgs = router.getAdditionalArgs();
    var isCancelled = function isCancelled() {
        return cancelled;
    };
    var cancel = function cancel() {
        return cancelled = true;
    };
    var done = function done(err, state) {
        if (!err && !isCancelled() && router.options.autoCleanUp) {
            (function () {
                var activeSegments = nameToIDs(toState.name);
                Object.keys(router._canDeact).forEach(function (name) {
                    if (activeSegments.indexOf(name) === -1) router._canDeact[name] = undefined;
                });
            })();
        }
        callback(isCancelled() ? { code: constants.TRANSITION_CANCELLED } : err, state || toState);
    };
    var makeError = function makeError(base, err) {
        return babelHelpers.extends({}, base, err instanceof Object ? err : { error: err });
    };

    var _transitionPath = transitionPath(toState, fromState);

    var toDeactivate = _transitionPath.toDeactivate;
    var toActivate = _transitionPath.toActivate;

    var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState, additionalArgs: [] };

    var canDeactivate = function canDeactivate(toState, fromState, cb) {
        var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
            return router._canDeact[name];
        }).reduce(function (fnMap, name) {
            return babelHelpers.extends({}, fnMap, babelHelpers.defineProperty({}, name, router._canDeact[name]));
        }, {});

        asyncProcess(canDeactivateFunctionMap, babelHelpers.extends({}, asyncBase, { additionalArgs: additionalArgs, errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: constants.CANNOT_DEACTIVATE }, err) : null);
        });
    };

    var canActivate = function canActivate(toState, fromState, cb) {
        var canActivateFunctionMap = toActivate.filter(function (name) {
            return router._canAct[name];
        }).reduce(function (fnMap, name) {
            return babelHelpers.extends({}, fnMap, babelHelpers.defineProperty({}, name, router._canAct[name]));
        }, {});

        asyncProcess(canActivateFunctionMap, babelHelpers.extends({}, asyncBase, { additionalArgs: additionalArgs, errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: constants.CANNOT_ACTIVATE }, err) : null);
        });
    };

    var middlewareFn = router.mware;
    var middleware = function middleware(toState, fromState, cb) {
        var mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

        asyncProcess(mwareFunction, babelHelpers.extends({}, asyncBase, { additionalArgs: additionalArgs }), function (err, state) {
            return cb(err ? makeError({ code: constants.TRANSITION_ERR }, err) : null, state || toState);
        });
    };

    var pipeline = (fromState && !options.forceDeactivate ? [canDeactivate] : []).concat(canActivate).concat(middlewareFn ? middleware : []);

    asyncProcess(pipeline, asyncBase, done);

    return cancel;
}