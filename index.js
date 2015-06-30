'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _routeNode = require('route-node');

var _routeNode2 = _interopRequireDefault(_routeNode);

var nameToIDs = function nameToIDs(name) {
    return name.split('.').reduce(function (ids, name) {
        ids.push(ids.length ? ids[ids.length - 1] + '.' + name : name);
        return ids;
    }, []);
};

var areStatesEqual = function areStatesEqual(state1, state2) {
    return state1.name === state2.name && state1.params.length === state2.params.length && Object.keys(state1.params).every(function (p) {
        return state1.params[p] === state2.params[p];
    });
};

var Router5 = (function () {
    function Router5(routes) {
        var _this = this;

        _classCallCheck(this, Router5);

        this.callbacks = [];
        this.lastStateAttempt = null;
        this.lastKnownState = null;
        this.rootNode = routes instanceof _routeNode2['default'] ? routes : new _routeNode2['default']('', '', routes);
        this.activeComponents = {};

        window.addEventListener('popstate', function (evt) {
            _this.lastStateAttempt = evt.state;
            _this._invokeCallbacks(evt.state, _this.lastKnownState);
        });
    }

    _createClass(Router5, [{
        key: '_invokeCallbacks',
        value: function _invokeCallbacks(newState, oldState) {
            var _this2 = this;

            this.callbacks.forEach(function (cb) {
                cb.call(_this2, newState, oldState);
            });
        }
    }, {
        key: 'addListener',
        value: function addListener(cb) {
            this.callbacks.push(cb);
        }
    }, {
        key: 'removeListener',
        value: function removeListener(cb) {
            this.callbacks = this.callbacks.filter(function (callback) {
                return callback !== cb;
            });
        }
    }, {
        key: 'buildPath',
        value: function buildPath(route, params) {
            return this.rootNode.buildPath(route, params);
        }
    }, {
        key: 'navigate',
        value: function navigate(name) {
            var params = arguments[1] === undefined ? {} : arguments[1];
            var opts = arguments[2] === undefined ? {} : arguments[2];

            var currentState = window.history.state;
            // let segments = this.rootNode.getSegmentsByName(name)
            // let path  = this.rootNode.buildPathFromSegments(segments, params)
            var path = this.rootNode.buildPath(name, params);

            if (!path) {
                throw new Error('Could not find route "' + name + '"');
            }

            this.lastStateAttempt = { name: name, path: path, params: params };

            if (this.lastKnownState) {
                console.log('ohohoho', areStatesEqual(this.lastKnownState, this.lastStateAttempt) ? 'true' : 'false');
                // Diff segments
                var segmentIds = nameToIDs(name);
                var activeSegmentIds = nameToIDs(this.lastKnownState.name);
                var maxI = Math.min(segmentIds.length, activeSegmentIds.length);
                for (i = 0; i < maxI; i += 1) {
                    if (activeSegmentIds[i] !== segmentIds[i]) break;
                }
                var segmentsToDeactivate = activeSegmentIds.slice(i);
                console.log('to deactivate: ', segmentsToDeactivate);
            }
            // Push to history
            window.history[opts.replace ? 'replaceState' : 'pushState'](this.lastStateAttempt, '', path);
            // Update lastKnowState
            this._invokeCallbacks(this.lastStateAttempt, this.lastKnownState);

            this.lastKnownState = this.lastStateAttempt;
        }
    }]);

    return Router5;
})();

exports['default'] = Router5;
module.exports = exports['default'];

