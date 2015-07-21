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
    'use strict';

    module.exports = transition;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _asyncProcess = _interopRequireDefault(_async);

    var _constants2 = _interopRequireDefault(_constants);

    var nameToIDs = function nameToIDs(name) {
        return name.split('.').reduce(function (ids, name) {
            return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
        }, []);
    };

    function transition(router, toState, fromState, callback) {
        var cancelled = false;
        var cancel = function cancel() {
            return cancelled = true;
        };
        var done = function done(err, res) {
            return callback(cancelled ? _constants2['default'].TRANSITION_CANCELLED : err, res);
        };

        var i = undefined;
        var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
        var toStateIds = nameToIDs(toState.name);
        var maxI = Math.min(fromStateIds.length, toStateIds.length);

        for (i = 0; i < maxI; i += 1) {
            if (fromStateIds[i] !== toStateIds[i]) break;
        }

        var toDeactivate = fromStateIds.slice(i).reverse();
        var toActivate = toStateIds.slice(i);
        var intersection = fromState ? i > 0 ? fromStateIds[i - 1] : '' : null;

        var canDeactivate = function canDeactivate(toState, fromState, cb) {
            if (cancelled) done();else {
                var canDeactivateFunctions = toDeactivate.map(function (name) {
                    return router._cmps[name];
                }).filter(function (comp) {
                    return comp && comp.canDeactivate;
                }).map(function (comp) {
                    return comp.canDeactivate;
                });

                (0, _asyncProcess['default'])(canDeactivateFunctions, toState, fromState, function (err, res) {
                    return cb(err ? _constants2['default'].CANNOT_DEACTIVATE : null, res);
                });
            }
        };

        var canActivate = function canActivate(toState, fromState, cb) {
            if (cancelled) done();else {
                var canActivateFunctions = toActivate.map(function (name) {
                    return router._canAct[name];
                }).filter(function (_) {
                    return _;
                });

                (0, _asyncProcess['default'])(canActivateFunctions, toState, fromState, function (err, res) {
                    return cb(err ? _constants2['default'].CANNOT_ACTIVATE : null, res);
                });
            }
        };

        var nodeListener = function nodeListener(toState, fromState, cb) {
            if (cancelled) done();else {
                var listeners = router._cbs['^' + intersection] || [];
                (0, _asyncProcess['default'])(listeners, toState, fromState, function (err, res) {
                    return cb(err ? _constants2['default'].NODE_LISTENER_ERR : null, res);
                }, true);
            }
        };

        var pipeline = fromState ? [canDeactivate, canActivate, nodeListener] : [canActivate];
        (0, _asyncProcess['default'])(pipeline, toState, fromState, done);

        return cancel;
    }
});