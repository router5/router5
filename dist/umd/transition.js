(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './async', './constants'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./async'), require('./constants'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.asyncProcess, global.constants);
        global.transition = mod.exports;
    }
})(this, function (exports, module, _async, _constants) {
    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    var _asyncProcess = _interopRequireDefault(_async);

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = { transition: transition, transitionPath: transitionPath };

    var nameToIDs = function nameToIDs(name) {
        return name.split('.').reduce(function (ids, name) {
            return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
        }, []);
    };

    function transitionPath(toState, fromState) {
        var i = undefined;
        var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
        var toStateIds = nameToIDs(toState.name);
        var maxI = Math.min(fromStateIds.length, toStateIds.length);

        if (fromState && fromState.name === toState.name) i = Math.max(maxI - 1, 0);else {
            for (i = 0; i < maxI; i += 1) {
                if (fromStateIds[i] !== toStateIds[i]) break;
            }
        }

        var toDeactivate = fromStateIds.slice(i).reverse();
        var toActivate = toStateIds.slice(i);
        var intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';

        return { intersection: intersection, toDeactivate: toDeactivate, toActivate: toActivate };
    }

    function transition(router, toState, fromState, callback) {
        var cancelled = false;
        var isCancelled = function isCancelled() {
            return cancelled;
        };
        var cancel = function cancel() {
            return cancelled = true;
        };
        var done = function done(err) {
            if (!err && !isCancelled() && router.options.autoCleanUp) {
                (function () {
                    var activeSegments = nameToIDs(toState.name);
                    Object.keys(router._cmps).filter(function (name) {
                        if (activeSegments.indexOf(name) === -1) router.deregisterComponent(name);
                    });
                })();
            }
            callback(isCancelled() ? { code: _constants2['default'].TRANSITION_CANCELLED } : err);
        };

        var _transitionPath = transitionPath(toState, fromState);

        var toDeactivate = _transitionPath.toDeactivate;
        var toActivate = _transitionPath.toActivate;

        var canDeactivate = function canDeactivate(toState, fromState, cb) {
            var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
                return router._cmps[name] && router._cmps[name].canDeactivate;
            }).reduce(function (fnMap, name) {
                return _extends({}, fnMap, _defineProperty({}, name, router._cmps[name].canDeactivate));
            }, {});

            (0, _asyncProcess['default'])(isCancelled, canDeactivateFunctionMap, toState, fromState, function (err) {
                return cb(err ? { code: _constants2['default'].CANNOT_DEACTIVATE, segment: err } : null);
            });
        };

        var canActivate = function canActivate(toState, fromState, cb) {
            var canActivateFunctionMap = toActivate.filter(function (name) {
                return router._canAct[name];
            }).reduce(function (fnMap, name) {
                return _extends({}, fnMap, _defineProperty({}, name, router._canAct[name]));
            }, {});

            (0, _asyncProcess['default'])(isCancelled, canActivateFunctionMap, toState, fromState, function (err) {
                return cb(err ? { code: _constants2['default'].CANNOT_ACTIVATE, segment: err } : null);
            });
        };

        var middlewareFn = router.mware;
        var middleware = function middleware(toState, fromState, cb) {
            var mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

            (0, _asyncProcess['default'])(isCancelled, mwareFunction, toState, fromState, function (err) {
                return cb(err ? { code: _constants2['default'].TRANSITION_ERR } : null);
            });
        };

        var pipeline = (fromState ? [canDeactivate] : []).concat(canActivate).concat(middlewareFn ? middleware : []);

        (0, _asyncProcess['default'])(isCancelled, pipeline, toState, fromState, done);

        return cancel;
    }
});