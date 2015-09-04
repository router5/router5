'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _routeNode = require('route-node');

var _routeNode2 = _interopRequireDefault(_routeNode);

var _transition2 = require('./transition');

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var makeState = function makeState(name, params, path) {
    return { name: name, params: params, path: path };
};

/**
 * Create a new Router5 instance
 * @class
 * @param {RouteNode[]|Object[]|RouteNode|Object} routes The router routes
 * @param {Object} [opts={}] The router options: useHash, defaultRoute and defaultParams can be specified.
 * @return {Router5} The router instance
 */

var Router5 = (function () {
    _createClass(Router5, null, [{
        key: 'ERR',

        /**
         * Error codes
         * @type {Object}
         */
        value: _constants2['default'],

        /**
         * An helper function to return instructions for a transition:
         * intersection route name, route names to deactivate, route names to activate
         * @param  {Object} toState   The state to go to
         * @param  {Object} fromState The state to go from
         * @return {Object}           An object containing 'intersection', 'toActivate' and 'toDeactivate' keys
         */
        enumerable: true
    }, {
        key: 'transitionPath',
        value: _transition2.transitionPath,
        enumerable: true
    }]);

    function Router5(routes) {
        var _this = this;

        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Router5);

        this.started = false;
        this._onTr = null;
        this._cbs = {};
        this._cmps = {};
        this._canAct = {};
        this.lastStateAttempt = null;
        this.lastKnownState = null;
        this.rootNode = routes instanceof _routeNode2['default'] ? routes : new _routeNode2['default']('', '', routes);
        this.options = {
            useHash: false,
            hashPrefix: '',
            base: '',
            trailingSlash: 0
        };
        Object.keys(opts).forEach(function (opt) {
            return _this.options[opt] = opts[opt];
        });
        this._setBase();
        // Bind onPopState
        this.boundOnPopState = this.onPopState.bind(this);
    }

    /**
     * @private
     */

    _createClass(Router5, [{
        key: '_setBase',
        value: function _setBase() {
            if (this.options.useHash && !this.options.base) this.options.base = _browser2['default'].getBase();
        }

        /**
         * Set an option value
         * @param  {String} opt The option to set
         * @param  {*}      val The option value
         * @return {Router5}    The Router5 instance
         */
    }, {
        key: 'setOption',
        value: function setOption(opt, val) {
            this.options[opt] = val;
            if (opt === 'useHash') this._setBase();
            return this;
        }

        /**
         * Add route(s)
         * @param  {RouteNode[]|Object[]|RouteNode|Object} routes Route(s) to add
         * @return {Router5}  The Router5 instance
         */
    }, {
        key: 'add',
        value: function add(routes) {
            this.rootNode.add(routes);
            return this;
        }

        /**
         * Add a route to the router.
         * @param {String}   name          The route name
         * @param {String}   path          The route path
         * @param {Function} [canActivate] A function to determine if the route can be activated.
         *                                 It will be invoked during a transition with `toState`
         *                                 and `fromState` parameters.
         * @return {Router5}             The Router5 instance
         */
    }, {
        key: 'addNode',
        value: function addNode(name, path, canActivate) {
            this.rootNode.addNode(name, path);
            if (canActivate) this._canAct[name] = canActivate;
            return this;
        }

        /**
         * @private
         */
    }, {
        key: 'onPopState',
        value: function onPopState(evt) {
            var _this2 = this;

            // Do nothing if no state or if last know state is poped state (it should never happen)
            var newState = !newState || !newState.name;
            var state = evt.state || this.matchPath(this.getLocation());
            if (!state) return;
            if (this.lastKnownState && this.areStatesEqual(state, this.lastKnownState)) {
                return;
            }

            this._transition(state, this.lastKnownState, function (err) {
                if (err) {
                    var url = _this2.buildUrl(_this2.lastKnownState.name, _this2.lastKnownState.params);
                    _browser2['default'].pushState(_this2.lastKnownState, '', url);
                } else {
                    _browser2['default'][newState ? 'pushState' : 'replaceState'](state, '', _this2.buildUrl(state.name, state.params));
                }
            });
        }

        /**
         * Set a transition middleware function
         * @param {Function} fn The middleware function
         */
    }, {
        key: 'onTransition',
        value: function onTransition(fn) {
            this._onTr = fn;
            return this;
        }

        /**
         * Start the router
         * @param  {String|Object} [startPathOrState] An optional start path or state
         *                                            (use it for universal applications)
         * @param  {Function}      [done]             An optional callback which will be called
         *                                            when starting is done
         * @return {Router5}  The router instance
         */
    }, {
        key: 'start',
        value: function start() {
            var _this3 = this;

            var args = [].concat(_slice.call(arguments));
            var lastArg = args.slice(-1)[0];
            var done = lastArg instanceof Function ? lastArg : null;
            var startPath = undefined,
                startState = undefined;

            if (this.started) {
                if (done) done(_constants2['default'].ROUTER_ALREADY_STARTED);
                return this;
            }

            if (args.length > 0) {
                if (typeof args[0] === 'string') startPath = args[0];
                if (typeof args[0] === 'object') startState = args[0];
            }

            this.started = true;
            var opts = this.options;

            // callback
            var cb = function cb(err, state) {
                var invokeErrCb = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

                _browser2['default'].addPopstateListener(_this3.boundOnPopState);
                if (done) done(err, state);
                if (err && invokeErrCb) _this3._invokeListeners('$error', state, null, err);
            };

            // Get start path
            if (!startPath && !startState) startPath = this.getLocation();

            if (!startState) {
                (function () {
                    // If no supplied start state, get start state
                    startState = _this3.matchPath(startPath);
                    // Navigate to default function
                    var navigateToDefault = function navigateToDefault() {
                        return _this3.navigate(opts.defaultRoute, opts.defaultParams, { replace: true }, function (err, state) {
                            return cb(err, state, false);
                        });
                    };
                    // If matched start path
                    if (startState) {
                        _this3.lastStateAttempt = startState;
                        _this3._transition(_this3.lastStateAttempt, _this3.lastKnownState, function (err, state) {
                            if (!err) {
                                _browser2['default'].replaceState(_this3.lastKnownState, '', _this3.buildUrl(startState.name, startState.params));
                                cb(null, state);
                            } else if (opts.defaultRoute) navigateToDefault();else cb(err, null, false);
                        });
                    } else if (opts.defaultRoute) {
                        // If default, navigate to default
                        navigateToDefault();
                    } else {
                        // No start match, no default => do nothing
                        cb(_constants2['default'].ROUTE_NOT_FOUND, null);
                    }
                })();
            } else {
                // Initialise router with provided start state
                this.lastKnownState = startState;
                _browser2['default'].replaceState(this.lastKnownState, '', this.buildUrl(startState.name, startState.params));
                cb(null, startState);
            }
            // Listen to popstate
            return this;
        }

        /**
         * Stop the router
         * @return {Router5} The router instance
         */
    }, {
        key: 'stop',
        value: function stop() {
            if (!this.started) return this;
            this.lastKnownState = null;
            this.lastStateAttempt = null;
            this.started = false;

            _browser2['default'].removePopstateListener(this.boundOnPopState);
            return this;
        }

        /**
         * Return the current state object
         * @return {Object} The current state
         */
    }, {
        key: 'getState',
        value: function getState() {
            return this.lastKnownState;
        }

        /**
         * Whether or not the given route name with specified params is active.
         * @param  {String}   name             The route name
         * @param  {Object}   [params={}]      The route parameters
         * @param  {Boolean}  [equality=false] If set to false (default), isActive will return true
         *                                     if the provided route name and params are descendants
         *                                     of the active state.
         * @return {Boolean}                   Whether nor not the route is active
         */
    }, {
        key: 'isActive',
        value: function isActive(name) {
            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var strictEquality = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var activeState = this.getState();

            if (!activeState) return false;

            if (strictEquality || activeState.name === name) {
                return this.areStatesEqual(makeState(name, params), activeState);
            }

            return this.areStatesDescendants(makeState(name, params), activeState);
        }

        /**
         * @private
         */
    }, {
        key: 'areStatesEqual',
        value: function areStatesEqual(state1, state2) {
            return state1.name === state2.name && Object.keys(state1.params).length === Object.keys(state2.params).length && Object.keys(state1.params).every(function (p) {
                return state1.params[p] === state2.params[p];
            });
        }

        /**
         * Whether two states are descendants
         * @param  {Object} parentState The parent state
         * @param  {Object} childState  The child state
         * @return {Boolean}            Whether the two provided states are related
         */
    }, {
        key: 'areStatesDescendants',
        value: function areStatesDescendants(parentState, childState) {
            var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
            if (!regex.test(childState.name)) return false;
            // If child state name extends parent state name, and all parent state params
            // are in child state params.
            return Object.keys(parentState.params).every(function (p) {
                return parentState.params[p] === childState.params[p];
            });
        }

        /**
         * @private
         */
    }, {
        key: '_invokeListeners',
        value: function _invokeListeners(name) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            (this._cbs[name] || []).forEach(function (cb) {
                return cb.apply(undefined, args);
            });
        }

        /**
         * @private
         */
    }, {
        key: '_addListener',
        value: function _addListener(name, cb, replace) {
            var normalizedName = name.replace(/^(\*|\^|=)/, '');
            if (normalizedName && !/^\$/.test(name)) {
                var segments = this.rootNode.getSegmentsByName(normalizedName);
                if (!segments) console.warn('No route found for ' + normalizedName + ', listener might never be called!');
            }
            if (!this._cbs[name]) this._cbs[name] = [];
            this._cbs[name] = (replace ? [] : this._cbs[name]).concat(cb);
            return this;
        }

        /**
         * @private
         */
    }, {
        key: '_removeListener',
        value: function _removeListener(name, cb) {
            if (this._cbs[name]) this._cbs[name] = this._cbs[name].filter(function (callback) {
                return callback !== cb;
            });
            return this;
        }

        /**
         * Add a route change listener
         * @param {Function} cb The listener to add
         * @return {Router5} The router instance
         */
    }, {
        key: 'addListener',
        value: function addListener(cb) {
            return this._addListener('*', cb);
        }

        /**
         * Remove a route change listener
         * @param  {Function} cb The listener to remove
         * @return {Router5} The router instance
         */
    }, {
        key: 'removeListener',
        value: function removeListener(cb) {
            return this._removeListener('*', cb);
        }

        /**
         * Add a node change listener
         * @param {String}   name The route segment full name
         * @param {Function} cb   The listener to add
         * @return {Router5} The router instance
         */
    }, {
        key: 'addNodeListener',
        value: function addNodeListener(name, cb) {
            return this._addListener('^' + name, cb, true);
        }

        /**
         * Remove a node change listener
         * @param {String}   name The route segment full name
         * @param {Function} cb   The listener to remove
         * @return {Router5} The router instance
         */
    }, {
        key: 'removeNodeListener',
        value: function removeNodeListener(name, cb) {
            this._cbs['^' + name] = [];
            return this;
        }

        /**
         * Add a route change listener
         * @param {String}   name The route name to listen to
         * @param {Function} cb   The listener to add
         * @return {Router5} The router instance
         */
    }, {
        key: 'addRouteListener',
        value: function addRouteListener(name, cb) {
            return this._addListener('=' + name, cb);
        }

        /**
         * Remove a route change listener
         * @param {String}   name The route name to listen to
         * @param {Function} cb   The listener to remove
         * @return {Router5} The router instance
         */
    }, {
        key: 'removeRouteListener',
        value: function removeRouteListener(name, cb) {
            return this._removeListener('=' + name, cb);
        }

        /**
         * Add a transition start callback
         * @param  {Function} cb The callback
         * @return {Router5}     The router instance
         */
    }, {
        key: 'onTransitionStart',
        value: function onTransitionStart(cb) {
            return this._addListener('$start', cb);
        }

        /**
         * Remove a transition start callback
         * @param  {Function} cb The callback
         * @return {Router5}     The router instance
         */
    }, {
        key: 'offTransitionStart',
        value: function offTransitionStart(cb) {
            return this._removeListener('$start', cb);
        }

        /**
         * Add a transition cancel callback
         * @param  {Function} cb The callback
         * @return {Router5}     The router instance
         */
    }, {
        key: 'onTransitionCancel',
        value: function onTransitionCancel(cb) {
            return this._addListener('$cancel', cb);
        }

        /**
         * Remove a transition cancel callback
         * @param  {Function} cb The callback
         * @return {Router5}     The router instance
         */
    }, {
        key: 'offTransitionCancel',
        value: function offTransitionCancel(cb) {
            return this._removeListener('$cancel', cb);
        }

        /**
         * Add a transition error callback
         * @param  {Function} cb The callback
         * @return {Router5}     The router instance
         */
    }, {
        key: 'onTransitionError',
        value: function onTransitionError(cb) {
            return this._addListener('$error', cb);
        }

        /**
         * Remove a transition error callback
         * @param  {Function} cb The callback
         * @return {Router5}     The router instance
         */
    }, {
        key: 'offTransitionError',
        value: function offTransitionError(cb) {
            return this._removeListener('$error', cb);
        }

        /**
         * Register an active component for a specific route segment
         * @param  {String} name      The route segment full name
         * @param  {Object} component The component instance
         */
    }, {
        key: 'registerComponent',
        value: function registerComponent(name, component) {
            if (this._cmps[name]) console.warn('A component was alread registered for route node ' + name + '.');
            this._cmps[name] = component;
            return this;
        }

        /**
         * Deregister an active component
         * @param  {String} name The route segment full name
         * @return {Router5} The router instance
         */
    }, {
        key: 'deregisterComponent',
        value: function deregisterComponent(name) {
            delete this._cmps[name];
        }

        /**
         * A function to determine whether or not a segment can be activated.
         * @param  {String}   name        The route name to register the canActivate method for
         * @param  {Function} canActivate The canActivate function. It should return `true`, `false`
         *                                or a promise
         * @return {Router5}  The router instance
         */
    }, {
        key: 'canActivate',
        value: function canActivate(name, _canActivate) {
            this._canAct[name] = _canActivate;
            return this;
        }

        /**
         * @private
         */
    }, {
        key: 'getLocation',
        value: function getLocation() {
            return _browser2['default'].getLocation(this.options);
        }

        /**
         * Generates an URL from a route name and route params.
         * The generated URL will be prefixed by hash if useHash is set to true
         * @param  {String} route  The route name
         * @param  {Object} params The route params (key-value pairs)
         * @return {String}        The built URL
         */
    }, {
        key: 'buildUrl',
        value: function buildUrl(route, params) {
            return this._buildUrl(this.rootNode.buildPath(route, params));
        }
    }, {
        key: '_buildUrl',
        value: function _buildUrl(path) {
            return this.options.base + (this.options.useHash ? '#' + this.options.hashPrefix : '') + path;
        }

        /**
         * Build a path from a route name and route params
         * The generated URL will be prefixed by hash if useHash is set to true
         * @param  {String} route  The route name
         * @param  {Object} params The route params (key-value pairs)
         * @return {String}        The built Path
         */
    }, {
        key: 'buildPath',
        value: function buildPath(route, params) {
            return this.rootNode.buildPath(route, params);
        }

        /**
         * Match a path against the route tree.
         * @param  {String} path   The path to match
         * @return {Object}        The matched state object (null if no match)
         */
    }, {
        key: 'matchPath',
        value: function matchPath(path) {
            var match = this.rootNode.matchPath(path, this.options.trailingSlash);
            return match ? makeState(match.name, match.params, path) : null;
        }

        /**
         * Parse / extract a path from an url
         * @param  {String} url The URL
         * @return {String}     The extracted path
         */
    }, {
        key: 'urlToPath',
        value: function urlToPath(url) {
            var match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
            var path = match ? match[1] : url;

            var pathParts = path.match(/^(.*?)(#.*?)?(\?.*)?$/);

            if (!pathParts) throw new Error('Could not parse url ' + url);

            var _pathParts$slice = pathParts.slice(1);

            var _pathParts$slice2 = _slicedToArray(_pathParts$slice, 3);

            var pathname = _pathParts$slice2[0];
            var hash = _pathParts$slice2[1];
            var search = _pathParts$slice2[2];

            var opts = this.options;

            return (opts.useHash ? hash.replace(new RegExp('^#' + opts.hashPrefix), '') : pathname.replace(new RegExp('^' + opts.base), '')) + (search || '');
        }

        /**
         * Parse path from an url and match it against the route tree.
         * @param  {String} url    The URL to match
         * @return {Object}        The matched state object (null if no match)
         */
    }, {
        key: 'matchUrl',
        value: function matchUrl(url) {
            return this.matchPath(this.urlToPath(url));
        }

        /**
         * @private
         */
    }, {
        key: '_transition',
        value: function _transition(toState, fromState, done) {
            var _this4 = this;

            // Cancel current transition
            if (this._tr) this._tr();
            this._invokeListeners('$start', toState, fromState);

            var tr = (0, _transition2.transition)(this, toState, fromState, function (err) {
                _this4._tr = null;

                if (err) {
                    if (err === _constants2['default'].TRANSITION_CANCELLED) _this4._invokeListeners('$cancel', toState, fromState);else _this4._invokeListeners('$error', toState, fromState, err);

                    if (done) done(err);
                    return;
                }

                _this4.lastKnownState = toState;
                _this4._invokeListeners('=' + toState.name, toState, fromState);
                _this4._invokeListeners('*', toState, fromState);

                if (done) done(null, toState);
            });

            this._tr = tr;
            return function () {
                return !tr || tr();
            };
        }

        /**
         * Navigate to a specific route
         * @param  {String}   name        The route name
         * @param  {Object}   [params={}] The route params
         * @param  {Object}   [opts={}]   The route options (replace, reload)
         * @param  {Function} done        A optional callback(err) to call when transition has been performed
         *                                either successfully or unsuccessfully.
         * @return {Function}             A cancellation function
         */
    }, {
        key: 'navigate',
        value: function navigate(name, params, opts, done) {
            if (params === undefined) params = {};

            var _this5 = this;

            if (opts === undefined) opts = {};

            if (!this.started) {
                if (done) done(_constants2['default'].ROUTER_NOT_STARTED);
                return;
            }

            var path = this.buildPath(name, params);
            var url = this.buildUrl(name, params);

            if (!path) {
                if (done) done(_constants2['default'].ROUTE_NOT_FOUND);
                this._invokeListeners('$error', null, this.lastKnownState, _constants2['default'].ROUTE_NOT_FOUND);
                return;
            }

            var toState = makeState(name, params, path);
            this.lastStateAttempt = toState;
            var sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false;

            // Do not proceed further if states are the same and no reload
            // (no desactivation and no callbacks)
            if (sameStates && !opts.reload) {
                if (done) done(_constants2['default'].SAME_STATES);
                this._invokeListeners('$error', toState, this.lastKnownState, _constants2['default'].SAME_STATES);
                return;
            }

            // Transition and amend history
            return this._transition(toState, sameStates ? null : this.lastKnownState, function (err, state) {
                if (err) {
                    if (done) done(err);
                    return;
                }

                _browser2['default'][opts.replace ? 'replaceState' : 'pushState'](_this5.lastStateAttempt, '', url);
                if (done) done(null, state);
            });
        }
    }]);

    return Router5;
})();

exports['default'] = Router5;
module.exports = exports['default'];