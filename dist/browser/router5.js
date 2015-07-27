/**
 * @license
 * @version 0.3.0
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Thomas Roch
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (window) {
    
    var constants = {
        ROUTER_NOT_STARTED: 'NOT_STARTED',
        ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
        SAME_STATES: 'SAME_STATES',
        CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
        CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
        NODE_LISTENER_ERR: 'NODE_ERR',
        TRANSITION_CANCELLED: 'CANCELLED'
    };/**
     * Dumb functions
     */
    
    function identity() {
        var _arguments = arguments;
    
        return function () {
            return _arguments[0];
        };
    }
    var noop = function noop() {};
    
    /**
     * Browser detection
     */
    var isBrowser = typeof window !== 'undefined';
    
    /**
     * Browser functions needed by router5
     */
    var getBase = function getBase() {
        return window.location.pathname.replace(/\/$/, '');
    };
    
    var pushState = function pushState(state, title, path) {
        return window.history.pushState(state, title, path);
    };
    
    var replaceState = function replaceState(state, title, path) {
        return window.history.replaceState(state, title, path);
    };
    
    var addPopstateListener = function addPopstateListener(fn) {
        return window.addEventListener('popstate', fn);
    };
    
    var removePopstateListener = function removePopstateListener(fn) {
        return window.removeEventListener('popstate', fn);
    };
    
    var getLocation = function getLocation(opts) {
        var path = opts.useHash ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '') : window.location.pathname.replace(new RegExp('^' + opts.base), '');
        return path + window.location.search;
    };
    
    /**
     * Export browser object
     */
    var browser = {};
    if (isBrowser) {
        browser = { getBase: getBase, pushState: pushState, replaceState: replaceState, addPopstateListener: addPopstateListener, removePopstateListener: removePopstateListener, getLocation: getLocation };
    } else {
        browser = {
            getBase: identity(''),
            pushState: noop,
            replaceState: noop,
            addPopstateListener: noop,
            removePopstateListener: noop,
            getLocation: identity('')
        };
    }
    function asyncProcess(functions, toState, fromState, callback) {
        var allowNoResult = arguments[4] === undefined ? false : arguments[4];
    
        var remainingSteps = functions || [];
    
        var processFn = function processFn(done) {
            if (!remainingSteps.length) return true;
    
            var len = remainingSteps[0].length;
            var res = remainingSteps[0](toState, fromState, done);
    
            if (typeof res === 'boolean') done(res ? null : true);else if (res && typeof res.then === 'function') {
                res.then(function () {
                    return done(null);
                }, function () {
                    return done(true);
                });
            } else if (len < 3 && allowNoResult) done(null);
    
            return false;
        };
    
        var iterate = function iterate(err) {
            if (err) callback(err);else {
                remainingSteps = remainingSteps.slice(1);
                next();
            }
        };
    
        var next = function next() {
            var finished = processFn(iterate);
            if (finished) callback(null);
        };
    
        next();
    }
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
            return callback(cancelled ? constants.TRANSITION_CANCELLED : err);
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
        var intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';
    
        var canDeactivate = function canDeactivate(toState, fromState, cb) {
            if (cancelled) done();else {
                var canDeactivateFunctions = toDeactivate.map(function (name) {
                    return router._cmps[name];
                }).filter(function (comp) {
                    return comp && comp.canDeactivate;
                }).map(function (comp) {
                    return comp.canDeactivate;
                });
    
                asyncProcess(canDeactivateFunctions, toState, fromState, function (err) {
                    return cb(err ? constants.CANNOT_DEACTIVATE : null);
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
    
                asyncProcess(canActivateFunctions, toState, fromState, function (err) {
                    return cb(err ? constants.CANNOT_ACTIVATE : null);
                });
            }
        };
    
        var nodeListener = function nodeListener(toState, fromState, cb) {
            if (cancelled) done();else {
                var listeners = router._cbs['^' + intersection] || [];
                asyncProcess(listeners, toState, fromState, function (err) {
                    return cb(err ? constants.NODE_LISTENER_ERR : null);
                }, true);
            }
        };
    
        var pipeline = fromState ? [canDeactivate, canActivate, nodeListener] : [canActivate, nodeListener];
        asyncProcess(pipeline, toState, fromState, done);
    
        return cancel;
    }
    var _slice = Array.prototype.slice;
    
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
            this.rootNode = routes instanceof RouteNode ? routes : new RouteNode('', '', routes);
            this.options = {
                useHash: false,
                hashPrefix: '',
                base: browser.getBase()
            };
            Object.keys(opts).forEach(function (opt) {
                return _this.options[opt] = opts[opt];
            });
            // Bind onPopState
            this.boundOnPopState = this.onPopState.bind(this);
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
             * @param {String}   name          The route name
             * @param {String}   path          The route path
             * @param {Function} [canActivate] A function to determine if the route can be activated.
             *                                 It will be invoked during a transition with `toState`
             *                                 and `fromState` parameters.
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
                    if (err) {
                        var url = _this2.buildUrl(_this2.lastKnownState.name, _this2.lastKnownState.params);
                        browser.pushState(_this2.lastKnownState, '', url);
                    }
                });
            }
        }, {
            key: 'start',
    
            /**
             * Start the router
             * @param  {String|Object} [startPathOrState] An optional start path or state
             *                                            (use it for universal applications)
             * @param  {Function}      [done]             An optional callback which will be called
             *                                            when starting is done
             * @return {Router5}  The router instance
             */
            value: function start() {
                var _this3 = this;
    
                var args = [].concat(_slice.call(arguments));
                var done = args.slice(-1)[0];
                var startPath = undefined,
                    startState = undefined;
    
                if (this.started) {
                    if (done) done(constants.ROUTER_ALREADY_STARTED);
                    return this;
                }
    
                if (args.length === 2) {
                    if (typeof args[0] === 'string') startPath = args[0];
                    if (typeof args[0] === 'object') startState = args[0];
                }
    
                this.started = true;
                var opts = this.options;
    
                // callback
                var cb = function cb(err, state) {
                    browser.addPopstateListener(_this3.boundOnPopState);
                    if (done) done(err, state);
                };
    
                // Get start path
                if (!startPath && !startState) startPath = this.getLocation();
    
                if (!startState) {
                    (function () {
                        // If no supplied start state, get start state
                        startState = _this3.matchPath(startPath);
                        // Navigate to default function
                        var navigateToDefault = function navigateToDefault() {
                            return _this3.navigate(opts.defaultRoute, opts.defaultParams, { replace: true }, cb);
                        };
                        // If matched start path
                        if (startState) {
                            _this3.lastStateAttempt = startState;
                            _this3._transition(_this3.lastStateAttempt, _this3.lastKnownState, function (err, state) {
                                if (!err) {
                                    browser.replaceState(_this3.lastKnownState, '', _this3.buildUrl(startState.name, startState.params));
                                    cb(null, state);
                                } else if (opts.defaultRoute) navigateToDefault();else cb(err);
                            });
                        } else if (opts.defaultRoute) {
                            // If default, navigate to default
                            navigateToDefault();
                        } else {
                            // No start match, no default => do nothing
                            cb(null);
                        }
                    })();
                } else {
                    // Initialise router with provided start state
                    this.lastKnownState = startState;
                    cb(null, startState);
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
                this.lastKnownState = null;
                this.lastStateAttempt = null;
                this.started = false;
    
                browser.removePopstateListener(this.boundOnPopState);
                return this;
            }
        }, {
            key: 'getState',
    
            /**
             * Return the current state object
             * @return {Object} The current state
             */
            value: function getState() {
                return this.lastKnownState;
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
             * A function to determine whether or not a segment can be activated.
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
                return browser.getLocation(this.options);
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
                return this.options.base + (this.options.useHash ? '#' + this.options.hashPrefix : '') + this.rootNode.buildPath(route, params);
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
    
                var tr = transition(this, toState, fromState, function (err) {
                    _this4._tr = null;
    
                    if (err) {
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
        }, {
            key: 'navigate',
    
            /**
             * Navigate to a specific route
             * @param  {String}   name        The route name
             * @param  {Object}   [params={}] The route params
             * @param  {Object}   [opts={}]   The route options (replace, reload)
             * @param  {Function} done        A optional callback(err) to call when transition has been performed
             *                                either successfully or unsuccessfully.
             * @return {Function}             A cancellation function
             */
            value: function navigate(name, params, opts, done) {
                if (params === undefined) params = {};
    
                var _this5 = this;
    
                if (opts === undefined) opts = {};
    
                if (!this.started) {
                    done(constants.ROUTER_NOT_STARTED);
                    return;
                }
    
                var path = this.buildPath(name, params);
                var url = this.buildUrl(name, params);
    
                if (!path) throw new Error('Could not find route "' + name + '"');
    
                var toState = makeState(name, params, path);
                this.lastStateAttempt = toState;
                var sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false;
    
                // Do not proceed further if states are the same and no reload
                // (no desactivation and no callbacks)
                if (sameStates && !opts.reload) {
                    if (done) done(constants.SAME_STATES);
                    return;
                }
    
                // Transition and amend history
                return this._transition(toState, this.lastKnownState, function (err, state) {
                    if (err) {
                        if (done) done(err);
                        return;
                    }
    
                    browser[opts.replace ? 'replaceState' : 'pushState'](_this5.lastStateAttempt, '', url);
                    if (done) done(null, state);
                });
            }
        }]);
    
        return Router5;
    })();
    
    Router5.ERR = constants;

    window.RouteNode = RouteNode;
    window.Router5 = Router5;

}(window));
