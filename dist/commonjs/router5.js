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
    return state1.name === state2.name && Object.keys(state1.params).length === Object.keys(state2.params).length && Object.keys(state1.params).every(function (p) {
        return state1.params[p] === state2.params[p];
    });
};

var makeState = function makeState(name, params, path) {
    return { name: name, params: params, path: path };
};

var Router5 = (function () {
    function Router5(routes) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Router5);

        this.started = false;
        this.callbacks = {};
        this.lastStateAttempt = null;
        this.lastKnownState = null;
        this.rootNode = routes instanceof _routeNode2['default'] ? routes : new _routeNode2['default']('', '', routes);
        this.activeComponents = {};
        this.options = opts;

        return this;
    }

    _createClass(Router5, [{
        key: 'add',
        value: function add(routes) {
            this.rootNode.add(routes);
            return this;
        }
    }, {
        key: 'onPopState',
        value: function onPopState(evt) {
            // Do nothing if no state or if last know state is poped state (it should never happen)
            if (!evt.state) return;
            if (this.lastKnownState && areStatesEqual(evt.state, this.lastKnownState)) return;

            this._transition(evt.state, this.lastKnownState);
            this.lastKnownState = evt.state;
        }
    }, {
        key: 'start',
        value: function start() {
            if (this.started) return this;
            this.started = true;

            // Try to match starting path name
            var startPath = this.options.useHash ? window.location.hash.replace(/^#/, '') : window.location.pathname;
            var startMatch = this.rootNode.matchPath(startPath);

            if (startMatch) {
                this.lastKnownState = makeState(startMatch.name, startMatch.params, startPath);
                window.history.replaceState(this.lastKnownState, '', this.options.useHash ? '#' + startPath : startPath);
            } else if (this.options.defaultRoute) {
                this.navigate(this.options.defaultRoute, this.options.defaultParams, { replace: true });
            }
            // Listen to popstate
            window.addEventListener('popstate', this.onPopState.bind(this));
            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (!this.started) return this;
            this.started = false;

            window.removeEventListener('popstate', this.onPopState.bind(this));
            return this;
        }
    }, {
        key: '_invokeCallbacks',
        value: function _invokeCallbacks(name, newState, oldState) {
            var _this = this;

            if (!this.callbacks[name]) return;
            this.callbacks[name].forEach(function (cb) {
                cb.call(_this, newState, oldState);
            });
        }
    }, {
        key: '_transition',
        value: function _transition(toState, fromState) {
            if (fromState) {
                var i = undefined;
                var fromStateIds = nameToIDs(fromState.name);
                var toStateIds = nameToIDs(toState.name);

                var maxI = Math.min(fromStateIds.length, toStateIds.length);
                for (i = 0; i < maxI; i += 1) {
                    if (fromStateIds[i] !== toStateIds[i]) break;
                }

                var segmentsToDeactivate = fromStateIds.slice(i);

                if (i > 0) this._invokeCallbacks(fromStateIds[i - 1], toState, fromState);
            }

            this._invokeCallbacks('', toState, fromState);
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this.lastKnownState;
        }
    }, {
        key: 'registerComponent',
        value: function registerComponent(name, component) {
            if (this.activeComponents[name]) console.warn('A component was alread registered for route node ' + name + '.');
            this.activeComponents[name] = component;
        }
    }, {
        key: 'deregisterComponent',
        value: function deregisterComponent(name) {
            delete this.activeComponents[name];
        }
    }, {
        key: 'addNodeListener',
        value: function addNodeListener(name, cb) {
            if (name) {
                var segments = this.rootNode.getSegmentsByName(name);
                if (!segments) console.warn('No route found for ' + name + ', listener could be never called!');
            }
            if (!this.callbacks[name]) this.callbacks[name] = [];
            this.callbacks[name].push(cb);
        }
    }, {
        key: 'removeNodeListener',
        value: function removeNodeListener(name, cb) {
            if (!this.callbacks[name]) return;
            this.callbacks[name] = this.callbacks[name].filter(function (callback) {
                return callback !== cb;
            });
        }
    }, {
        key: 'addListener',
        value: function addListener(cb) {
            this.addNodeListener('', cb);
        }
    }, {
        key: 'removeListener',
        value: function removeListener(cb) {
            this.removeNodeListener('', cb);
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

            if (!this.started) return;

            var currentState = window.history.state;
            // let segments = this.rootNode.getSegmentsByName(name)
            // let path  = this.rootNode.buildPathFromSegments(segments, params)
            var path = this.rootNode.buildPath(name, params);

            if (!path) throw new Error('Could not find route "' + name + '"');

            this.lastStateAttempt = makeState(name, params, path);
            var sameStates = this.lastKnownState ? areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false;

            // Do not proceed further if states are the same and no reload
            // (no desactivation and no callbacks)
            if (sameStates && !opts.reload) return;
            // Transition and amend history
            if (!sameStates) {
                this._transition(this.lastStateAttempt, this.lastKnownState);
                window.history[opts.replace ? 'replaceState' : 'pushState'](this.lastStateAttempt, '', this.options.useHash ? '#' + path : path);
            }

            // Update lastKnowState
            this.lastKnownState = this.lastStateAttempt;
        }
    }]);

    return Router5;
})();

exports['default'] = Router5;
module.exports = exports['default'];