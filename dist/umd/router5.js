(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', 'route-node', './transition', './constants'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('route-node'), require('./transition'), require('./constants'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.RouteNode, global.transition, global.constants);
        global.Router5 = mod.exports;
    }
})(this, function (exports, module, _routeNode, _transition2, _constants) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _RouteNode = _interopRequireDefault(_routeNode);

    var _transition3 = _interopRequireDefault(_transition2);

    var _constants2 = _interopRequireDefault(_constants);

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
        function Router5(routes) {
            var _this = this;

            var opts = arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, Router5);

            this.started = false;
            this._cbs = {};
            this._cmps = {};
            this._canAct = {};
            this.lastStateAttempt = null;
            this.lastKnownState = null;
            this.rootNode = routes instanceof _RouteNode['default'] ? routes : new _RouteNode['default']('', '', routes);
            this.options = {
                useHash: false,
                hashPrefix: ''
            };
            Object.keys(opts).forEach(function (opt) {
                return _this.options[opt] = opts[opt];
            });
            this.base = window.location.pathname.replace(/^\/$/, '');

            return this;
        }

        _createClass(Router5, [{
            key: 'setOption',

            /**
             * Set an option value
             * @param  {String} opt The option to set
             * @param  {*}      val The option value
             * @return {Router5}    The Router5 instance
             */
            value: function setOption(opt, val) {
                this.options[opt] = val;
                return this;
            }
        }, {
            key: 'add',

            /**
             * Add route(s)
             * @param  {RouteNode[]|Object[]|RouteNode|Object} routes Route(s) to add
             * @return {Router5}  The Router5 instance
             */
            value: function add(routes) {
                this.rootNode.add(routes);
                return this;
            }
        }, {
            key: 'addNode',

            /**
             * Add a route to the router.
             * @param {String}   name        The route name
             * @param {String}   path        The route path
             * @param {Function} canActivate A function to determine if the route can be activated.
             *                               It will be invoked during a transition with `toState`
             *                               and `fromState` parameters.
             * @return {Router5}             The Router5 instance
             */
            value: function addNode(name, path, canActivate) {
                this.rootNode.addNode(name, path);
                if (canActivate) this._canAct[name] = canActivate;
                return this;
            }
        }, {
            key: 'onPopState',

            /**
             * @private
             */
            value: function onPopState(evt) {
                var _this2 = this;

                // Do nothing if no state or if last know state is poped state (it should never happen)
                var state = evt.state || this.matchPath(this.getLocation());
                if (!state) return;
                if (this.lastKnownState && this.areStatesEqual(state, this.lastKnownState)) return;

                this._transition(state, this.lastKnownState, function (err) {
                    if (!err) {
                        var url = _this2.buildUrl(_this2.lastKnownState.name, _this2.lastKnownState.params);
                        window.history.pushState(_this2.lastKnownState, '', url);
                    }
                });
            }
        }, {
            key: 'start',

            /**
             * Start the router
             * @param  {Function} done An optional callback which will be called when starting is done
             * @return {Router5}  The router instance
             */
            value: function start(done) {
                var _this3 = this;

                if (this.started) return this;
                this.started = true;
                var opts = this.options;

                // Try to match starting path name
                var startPath = this.getLocation();
                var startState = this.matchPath(startPath);

                var cb = function cb(err) {
                    window.addEventListener('popstate', _this3.onPopState.bind(_this3));
                    if (done) done(err);
                };

                var navigateToDefault = function navigateToDefault() {
                    return _this3.navigate(opts.defaultRoute, opts.defaultParams, { replace: true }, cb);
                };

                if (startState) {
                    this.lastStateAttempt = startState;
                    this._transition(this.lastStateAttempt, this.lastKnownState, function (err) {
                        if (!err) {
                            window.history.replaceState(_this3.lastKnownState, '', _this3.buildUrl(startState.name, startState.params));
                            cb(null);
                        } else if (opts.defaultRoute) navigateToDefault();else cb(err);
                    });
                } else if (opts.defaultRoute) {
                    navigateToDefault();
                } else {
                    cb();
                }
                // Listen to popstate
                return this;
            }
        }, {
            key: 'stop',

            /**
             * Stop the router
             * @return {Router5} The router instance
             */
            value: function stop() {
                if (!this.started) return this;
                this.started = false;

                window.removeEventListener('popstate', this.onPopState.bind(this));
                return this;
            }
        }, {
            key: 'getState',

            /**
             * Return the current state object
             * @return {Object} The current state
             */
            value: function getState() {
                return this.lastKnownState
                // return window.history.state
                ;
            }
        }, {
            key: 'isActive',

            /**
             * Whether or not the given route name with specified params is active.
             * @param  {String}   name             The route name
             * @param  {Object}   [params={}]      The route parameters
             * @param  {Boolean}  [equality=false] If set to false (default), isActive will return true
             *                                     if the provided route name and params are descendants
             *                                     of the active state.
             * @return {Boolean}                   Whether nor not the route is active
             */
            value: function isActive(name) {
                var params = arguments[1] === undefined ? {} : arguments[1];
                var strictEquality = arguments[2] === undefined ? false : arguments[2];

                var activeState = this.getState();

                if (!activeState) return false;

                if (strictEquality || activeState.name === name) {
                    return this.areStatesEqual(makeState(name, params), activeState);
                }

                return this.areStatesDescendants(makeState(name, params), activeState);
            }
        }, {
            key: 'areStatesEqual',

            /**
             * @private
             */
            value: function areStatesEqual(state1, state2) {
                return state1.name === state2.name && Object.keys(state1.params).length === Object.keys(state2.params).length && Object.keys(state1.params).every(function (p) {
                    return state1.params[p] === state2.params[p];
                });
            }
        }, {
            key: 'areStatesDescendants',

            /**
             * Whether two states are descendants
             * @param  {Object} parentState The parent state
             * @param  {Object} childState  The child state
             * @return {Boolean}            Whether the two provided states are related
             */
            value: function areStatesDescendants(parentState, childState) {
                var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
                if (!regex.test(childState.name)) return false;
                // If child state name extends parent state name, and all parent state params
                // are in child state params.
                return Object.keys(parentState.params).every(function (p) {
                    return parentState.params[p] === childState.params[p];
                });
            }
        }, {
            key: '_invokeListeners',

            /**
             * @private
             */
            value: function _invokeListeners(name, newState, oldState) {
                (this._cbs[name] || []).forEach(function (cb) {
                    return cb(newState, oldState);
                });
            }
        }, {
            key: '_addListener',

            /**
             * @private
             */
            value: function _addListener(name, cb, replace) {
                var normalizedName = name.replace(/^(\*|\^|=)/, '');
                if (normalizedName) {
                    var segments = this.rootNode.getSegmentsByName(normalizedName);
                    if (!segments) console.warn('No route found for ' + normalizedName + ', listener might never be called!');
                }
                if (!this._cbs[name]) this._cbs[name] = [];
                this._cbs[name] = (replace ? [] : this._cbs[name]).concat(cb);
                return this;
            }
        }, {
            key: '_removeListener',

            /**
             * @private
             */
            value: function _removeListener(name, cb) {
                if (this._cbs[name]) this._cbs[name] = this._cbs[name].filter(function (callback) {
                    return callback !== cb;
                });
                return this;
            }
        }, {
            key: 'addListener',

            /**
             * Add a route change listener
             * @param {Function} cb The listener to add
             * @return {Router5} The router instance
             */
            value: function addListener(cb) {
                return this._addListener('*', cb);
            }
        }, {
            key: 'removeListener',

            /**
             * Remove a route change listener
             * @param  {Function} cb The listener to remove
             * @return {Router5} The router instance
             */
            value: function removeListener(cb) {
                return this._removeListener('*', cb);
            }
        }, {
            key: 'addNodeListener',

            /**
             * Add a node change listener
             * @param {String}   name The route segment full name
             * @param {Function} cb   The listener to add
             * @return {Router5} The router instance
             */
            value: function addNodeListener(name, cb) {
                return this._addListener('^' + name, cb, true);
            }
        }, {
            key: 'removeNodeListener',

            /**
             * Remove a node change listener
             * @param {String}   name The route segment full name
             * @param {Function} cb   The listener to remove
             * @return {Router5} The router instance
             */
            value: function removeNodeListener(name, cb) {
                this._cbs['^' + name] = [];
                return this;
            }
        }, {
            key: 'addRouteListener',

            /**
             * Add a route change listener
             * @param {String}   name The route name to listen to
             * @param {Function} cb   The listener to add
             * @return {Router5} The router instance
             */
            value: function addRouteListener(name, cb) {
                return this._addListener('=' + name, cb);
            }
        }, {
            key: 'removeRouteListener',

            /**
             * Remove a route change listener
             * @param {String}   name The route name to listen to
             * @param {Function} cb   The listener to remove
             * @return {Router5} The router instance
             */
            value: function removeRouteListener(name, cb) {
                return this._removeListener('=' + name, cb);
            }
        }, {
            key: 'registerComponent',

            /**
             * Register an active component for a specific route segment
             * @param  {String} name      The route segment full name
             * @param  {Object} component The component instance
             */
            value: function registerComponent(name, component) {
                if (this._cmps[name]) console.warn('A component was alread registered for route node ' + name + '.');
                this._cmps[name] = component;
                return this;
            }
        }, {
            key: 'deregisterComponent',

            /**
             * Deregister an active component
             * @param  {String} name The route segment full name
             * @return {Router5} The router instance
             */
            value: function deregisterComponent(name) {
                delete this._cmps[name];
            }
        }, {
            key: 'canActivate',

            /**
             * [registerCanActivate description]
             * @param  {String}   name        The route name to register the canActivate method for
             * @param  {Function} canActivate The canActivate function. It should return `true`, `false`
             *                                or a promise
             * @return {Router5}  The router instance
             */
            value: function canActivate(name, _canActivate) {
                this._canAct[name] = _canActivate;
                return this;
            }
        }, {
            key: 'getLocation',

            /**
             * @private
             */
            value: function getLocation() {
                var path = this.options.useHash ? window.location.hash.replace(new RegExp('^#' + this.options.hashPrefix), '') : window.location.pathname.replace(new RegExp('^' + this.base), '');
                return path + window.location.search;
            }
        }, {
            key: 'buildUrl',

            /**
             * Generates an URL from a route name and route params.
             * The generated URL will be prefixed by hash if useHash is set to true
             * @param  {String} route  The route name
             * @param  {Object} params The route params (key-value pairs)
             * @return {String}        The built URL
             */
            value: function buildUrl(route, params) {
                return (this.options.useHash ? window.location.pathname + '#' + this.options.hashPrefix : this.base) + this.rootNode.buildPath(route, params);
            }
        }, {
            key: 'buildPath',

            /**
             * Build a path from a route name and route params
             * The generated URL will be prefixed by hash if useHash is set to true
             * @param  {String} route  The route name
             * @param  {Object} params The route params (key-value pairs)
             * @return {String}        The built Path
             */
            value: function buildPath(route, params) {
                return this.rootNode.buildPath(route, params);
            }
        }, {
            key: 'matchPath',

            /**
             * Match a path against the route tree.
             * @param  {String} path   The path / URL to match
             * @return {Object}        The matched state object (null if no match)
             */
            value: function matchPath(path) {
                var match = this.rootNode.matchPath(path);
                return match ? makeState(match.name, match.params, path) : null;
            }
        }, {
            key: '_transition',

            /**
             * @private
             */
            value: function _transition(toState, fromState, done) {
                var _this4 = this;

                // Cancel current transition
                if (this._tr) this._tr();

                var tr = (0, _transition3['default'])(this, toState, fromState, function (err) {
                    _this4._tr = null;

                    if (err) {
                        if (done) done(err);
                        return;
                    }

                    _this4.lastKnownState = toState;
                    _this4._invokeListeners('=' + toState.name, toState, fromState);
                    _this4._invokeListeners('*', toState, fromState);

                    if (done) done(null, true);
                });

                this._tr = tr;
                return function () {
                    return !tr || tr();
                };
            }
        }, {
            key: 'navigate',

            /**
             * Navigate to a specific route
             * @param  {String}   name        The route name
             * @param  {Object}   [params={}] The route params
             * @param  {Object}   [opts={}]   The route options (replace, reload)
             * @param  {Function} done        A optional callback (err, res) to call when transition has been performed
             *                                either successfully or unsuccessfully.
             * @return {Function}             A cancellation function
             */
            value: function navigate(name, params, opts, done) {
                if (params === undefined) params = {};

                var _this5 = this;

                if (opts === undefined) opts = {};

                if (!this.started) {
                    done(_constants2['default'].ROUTER_NOT_STARTED);
                    return;
                }

                var path = this.buildPath(name, params);
                var url = this.buildUrl(name, params);

                if (!path) throw new Error('Could not find route "' + name + '"');

                this.lastStateAttempt = makeState(name, params, path);
                var sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false;

                // Do not proceed further if states are the same and no reload
                // (no desactivation and no callbacks)
                if (sameStates && !opts.reload) {
                    if (done) done(_constants2['default'].SAME_STATES);
                    return;
                }

                // Transition and amend history
                return this._transition(this.lastStateAttempt, this.lastKnownState, function (err) {
                    if (err) {
                        if (done) done(err);
                        return;
                    }

                    window.history[opts.replace ? 'replaceState' : 'pushState'](_this5.lastStateAttempt, '', url);
                    if (done) done(null, true);
                });
            }
        }]);

        return Router5;
    })();

    module.exports = Router5;
});