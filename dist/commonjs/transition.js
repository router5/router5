'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = transition;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('./async');

var _async2 = _interopRequireDefault(_async);

var _constants = require('./constants');

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
    var done = function done(err) {
        return callback(cancelled ? _constants2['default'].TRANSITION_CANCELLED : err);
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

            (0, _async2['default'])(canDeactivateFunctions, toState, fromState, function (err) {
                return cb(err ? _constants2['default'].CANNOT_DEACTIVATE : null);
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

            (0, _async2['default'])(canActivateFunctions, toState, fromState, function (err) {
                return cb(err ? _constants2['default'].CANNOT_ACTIVATE : null);
            });
        }
    };

    var nodeListener = function nodeListener(toState, fromState, cb) {
        if (cancelled) done();else {
            var listeners = router._cbs['^' + intersection] || [];
            (0, _async2['default'])(listeners, toState, fromState, function (err) {
                return cb(err ? _constants2['default'].NODE_LISTENER_ERR : null);
            }, true);
        }
    };

    var pipeline = fromState ? [canDeactivate, canActivate, nodeListener] : [canActivate];
    (0, _async2['default'])(pipeline, toState, fromState, done);

    return cancel;
}

module.exports = exports['default'];