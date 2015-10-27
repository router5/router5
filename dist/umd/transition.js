(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', 'router5.transition-path', './async', './constants'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('router5.transition-path'), require('./async'), require('./constants'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.transitionPath, global.asyncProcess, global.constants);
        global.transition = mod.exports;
    }
})(this, function (exports, module, _router5TransitionPath, _async, _constants) {
    'use strict';

    // istanbul ignore next

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    // istanbul ignore next

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    // istanbul ignore next

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    var _transitionPath2 = _interopRequireDefault(_router5TransitionPath);

    var _asyncProcess = _interopRequireDefault(_async);

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = transition;

    var nameToIDs = function nameToIDs(name) {
        return name.split('.').reduce(function (ids, name) {
            return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
        }, []);
    };

    function transition(router, toState, fromState, callback) {
        var cancelled = false;
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
            callback(isCancelled() ? { code: _constants2['default'].TRANSITION_CANCELLED } : err, state || toState);
        };

        var _transitionPath = (0, _transitionPath2['default'])(toState, fromState);

        var toDeactivate = _transitionPath.toDeactivate;
        var toActivate = _transitionPath.toActivate;

        var canDeactivate = function canDeactivate(toState, fromState, cb) {
            var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
                return router._cmps[name] && router._cmps[name].canDeactivate;
            }).reduce(function (fnMap, name) {
                return _extends({}, fnMap, _defineProperty({}, name, router._cmps[name].canDeactivate));
            }, {});

            (0, _asyncProcess['default'])(canDeactivateFunctionMap, { isCancelled: isCancelled, toState: toState, fromState: fromState }, function (err) {
                return cb(err ? { code: _constants2['default'].CANNOT_DEACTIVATE, segment: err } : null);
            });
        };

        var canActivate = function canActivate(toState, fromState, cb) {
            var canActivateFunctionMap = toActivate.filter(function (name) {
                return router._canAct[name];
            }).reduce(function (fnMap, name) {
                return _extends({}, fnMap, _defineProperty({}, name, router._canAct[name]));
            }, {});

            (0, _asyncProcess['default'])(canActivateFunctionMap, { isCancelled: isCancelled, toState: toState, fromState: fromState }, function (err) {
                return cb(err ? { code: _constants2['default'].CANNOT_ACTIVATE, segment: err } : null);
            });
        };

        var middlewareFn = router.mware;
        var middleware = function middleware(toState, fromState, cb) {
            var mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

            (0, _asyncProcess['default'])(mwareFunction, { isCancelled: isCancelled, toState: toState, fromState: fromState, context: { cancel: cancel, router: router } }, function (err, state) {
                var errObj = err ? typeof err === 'object' ? err : { error: err } : null;
                cb(err ? _extends({ code: _constants2['default'].TRANSITION_ERR }, errObj) : null, state || toState);
            });
        };

        var pipeline = (fromState ? [canDeactivate] : []).concat(canActivate).concat(middlewareFn ? middleware : []);

        (0, _asyncProcess['default'])(pipeline, { isCancelled: isCancelled, toState: toState, fromState: fromState }, done);

        return cancel;
    }
});