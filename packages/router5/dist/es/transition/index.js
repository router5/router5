var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import transitionPath, { nameToIDs } from 'router5.transition-path';
import resolve from './resolve';
import { errorCodes } from '../constants';

export default transition;

function transition(router, toState, fromState, opts, callback) {
    var cancelled = false;
    var completed = false;
    var options = router.getOptions();

    var _router$getLifecycleF = router.getLifecycleFunctions(),
        _router$getLifecycleF2 = _slicedToArray(_router$getLifecycleF, 2),
        canDeactivateFunctions = _router$getLifecycleF2[0],
        canActivateFunctions = _router$getLifecycleF2[1];

    var middlewareFunctions = router.getMiddlewareFunctions();
    var isCancelled = function isCancelled() {
        return cancelled;
    };
    var cancel = function cancel() {
        if (!cancelled && !completed) {
            cancelled = true;
            callback({ code: errorCodes.TRANSITION_CANCELLED }, null);
        }
    };
    var done = function done(err, state) {
        completed = true;

        if (isCancelled()) {
            return;
        }

        if (!err && options.autoCleanUp) {
            var activeSegments = nameToIDs(toState.name);
            Object.keys(canDeactivateFunctions).forEach(function (name) {
                if (activeSegments.indexOf(name) === -1) router.clearCanDeactivate(name);
            });
        }

        callback(err, state || toState);
    };
    var makeError = function makeError(base, err) {
        return _extends({}, base, err instanceof Object ? err : { error: err });
    };

    var _transitionPath = transitionPath(toState, fromState),
        toDeactivate = _transitionPath.toDeactivate,
        toActivate = _transitionPath.toActivate;

    var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState };

    var canDeactivate = function canDeactivate(toState, fromState, cb) {
        var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
            return canDeactivateFunctions[name];
        }).reduce(function (fnMap, name) {
            return _extends({}, fnMap, _defineProperty({}, name, canDeactivateFunctions[name]));
        }, {});

        resolve(canDeactivateFunctionMap, _extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: errorCodes.CANNOT_DEACTIVATE }, err) : null);
        });
    };

    var canActivate = function canActivate(toState, fromState, cb) {
        var canActivateFunctionMap = toActivate.filter(function (name) {
            return canActivateFunctions[name];
        }).reduce(function (fnMap, name) {
            return _extends({}, fnMap, _defineProperty({}, name, canActivateFunctions[name]));
        }, {});

        resolve(canActivateFunctionMap, _extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: errorCodes.CANNOT_ACTIVATE }, err) : null);
        });
    };

    var middleware = !middlewareFunctions.length ? [] : function (toState, fromState, cb) {
        return resolve(middlewareFunctions, _extends({}, asyncBase), function (err, state) {
            return cb(err ? makeError({ code: errorCodes.TRANSITION_ERR }, err) : null, state || toState);
        });
    };

    var pipeline = (fromState && !opts.forceDeactivate ? [canDeactivate] : []).concat(canActivate).concat(middleware);

    resolve(pipeline, asyncBase, done);

    return cancel;
}