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
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _asyncProcess = _interopRequireDefault(_async);

    var _constants2 = _interopRequireDefault(_constants);

    module.exports = { transition: transition, transitionPath: transitionPath };

    function transitionPath(toState, fromState) {
        var nameToIDs = function nameToIDs(name) {
            return name.split('.').reduce(function (ids, name) {
                return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
            }, []);
        };

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
            return callback(cancelled ? _constants2['default'].TRANSITION_CANCELLED : err);
        };

        var _transitionPath = transitionPath(toState, fromState);

        var toDeactivate = _transitionPath.toDeactivate;
        var toActivate = _transitionPath.toActivate;

        var canDeactivate = function canDeactivate(toState, fromState, cb) {
            var canDeactivateFunctions = toDeactivate.map(function (name) {
                return router._cmps[name];
            }).filter(function (comp) {
                return comp && comp.canDeactivate;
            }).map(function (comp) {
                return comp.canDeactivate;
            });

            (0, _asyncProcess['default'])(isCancelled, canDeactivateFunctions, toState, fromState, function (err) {
                return cb(err ? _constants2['default'].CANNOT_DEACTIVATE : null);
            });
        };

        var canActivate = function canActivate(toState, fromState, cb) {
            var canActivateFunctions = toActivate.map(function (name) {
                return router._canAct[name];
            }).filter(function (_) {
                return _;
            });

            (0, _asyncProcess['default'])(isCancelled, canActivateFunctions, toState, fromState, function (err) {
                return cb(err ? _constants2['default'].CANNOT_ACTIVATE : null);
            });
        };

        var middlewareFn = router.mware;
        var middleware = function middleware(toState, fromState, cb) {
            var mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

            (0, _asyncProcess['default'])(isCancelled, mwareFunction, toState, fromState, function (err) {
                return cb(err ? _constants2['default'].TRANSITION_ERR : null);
            });
        };

        var pipeline = (fromState ? [canDeactivate] : []).concat(canActivate).concat(middlewareFn ? middleware : []);

        (0, _asyncProcess['default'])(isCancelled, pipeline, toState, fromState, done);

        return cancel;
    }
});