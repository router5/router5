'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;

var _router = require('router5.transition-path');

var _router2 = _interopRequireDefault(_router);

var _async = require('./async');

var _async2 = _interopRequireDefault(_async);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

exports.default = transition;

var nameToIDs = function nameToIDs(name) {
    return name.split('.').reduce(function (ids, name) {
        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
    }, []);
};

function transition(router, toState, fromState, callback) {
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
                Object.keys(router._cmps).filter(function (name) {
                    if (activeSegments.indexOf(name) === -1) router.deregisterComponent(name);
                });
            })();
        }
        callback(isCancelled() ? { code: _constants2.default.TRANSITION_CANCELLED } : err, state || toState);
    };

    var _transitionPath = (0, _router2.default)(toState, fromState);

    var toDeactivate = _transitionPath.toDeactivate;
    var toActivate = _transitionPath.toActivate;

    var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState, additionalArgs: [] };

    var canDeactivate = function canDeactivate(toState, fromState, cb) {
        var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
            return router._cmps[name] && router._cmps[name].canDeactivate;
        }).reduce(function (fnMap, name) {
            var _extends2;

            return _extends({}, fnMap, (_extends2 = {}, _extends2[name] = router._cmps[name].canDeactivate, _extends2));
        }, {});

        (0, _async2.default)(canDeactivateFunctionMap, _extends({}, asyncBase, { additionalArgs: additionalArgs }), function (err) {
            return cb(err ? { code: _constants2.default.CANNOT_DEACTIVATE, segment: err } : null);
        });
    };

    var canActivate = function canActivate(toState, fromState, cb) {
        var canActivateFunctionMap = toActivate.filter(function (name) {
            return router._canAct[name];
        }).reduce(function (fnMap, name) {
            var _extends3;

            return _extends({}, fnMap, (_extends3 = {}, _extends3[name] = router._canAct[name], _extends3));
        }, {});

        (0, _async2.default)(canActivateFunctionMap, _extends({}, asyncBase, { additionalArgs: additionalArgs }), function (err) {
            return cb(err ? { code: _constants2.default.CANNOT_ACTIVATE, segment: err } : null);
        });
    };

    var middlewareFn = router.mware;
    var middleware = function middleware(toState, fromState, cb) {
        var mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

        (0, _async2.default)(mwareFunction, _extends({}, asyncBase, { context: { cancel: cancel, router: router } }), function (err, state) {
            var errObj = err ? (typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? err : { error: err } : null;
            cb(err ? _extends({ code: _constants2.default.TRANSITION_ERR }, errObj) : null, state || toState);
        });
    };

    var pipeline = (fromState ? [canDeactivate] : []).concat(canActivate).concat(middlewareFn ? middleware : []);

    (0, _async2.default)(pipeline, asyncBase, done);

    return cancel;
}
module.exports = exports['default'];