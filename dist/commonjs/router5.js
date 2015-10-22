Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _routeNode = require('route-node');

var _routeNode2 = _interopRequireDefault(_routeNode);

var _transition2 = require('./transition');

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

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

        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Router5);

        this.started = false;
        this.mware = null;
        this._cbs = {};
        this._cmps = {};
        this._canAct = {};
        this.lastStateAttempt = null;
        this.lastKnownState = null;
        this.rootNode = routes instanceof _routeNode2['default'] ? routes : new _routeNode2['default']('', '', routes);
        this.options = {
            useHash: false,
            hashPrefix: '',
            base: false,
            trailingSlash: 0,
            autoCleanUp: true
        };
        Object.keys(opts).forEach(function (opt) {
            return _this.options[opt] = opts[opt];
        });
        this.registeredPlugins = {};
        // Bind onPopState
    }

    /**
     * Error codes
     * @type {Object}
     */

    /**
     * Set an option value
     * @param  {String} opt The option to set
     * @param  {*}      val The option value
     * @return {Router5}    The Router5 instance
     */

    _createClass(Router5, [{
        key: 'setOption',
        value: function setOption(opt, val) {
            this.options[opt] = val;
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
    }, {
        key: 'usePlugin',
        value: function usePlugin(plugin) {
            var _this2 = this;

            if (!plugin.name) console.warn('[router5.registerPlugin(plugin)] Missing property pluginName');

            var pluginMethods = ['onStart', 'onStop', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];
            var defined = pluginMethods.concat('init').some(function (method) {
                return plugin[method] !== undefined;
            });

            if (!defined) throw new Error('[router5] plugin ' + plugin.name + ' has none of the expected methods implemented');
            this.registeredPlugins[plugin.name] = plugin;

            if (plugin.init) plugin.init(this);

            pluginMethods.forEach(function (method) {
                if (plugin[method]) {
                    _this2._addListener(method.toLowerCase().replace(/^on/, '$$').replace(/transition/, '$$'), plugin[method]);
                }
            });

            return this;
        }

        /**
         * Set a transition middleware function `.useMiddleware(fn1, fn2, fn3, ...)`
         * @param {Function} fn The middleware function
         */
    }, {
        key: 'useMiddleware',
        value: function useMiddleware() {
            this.mware = Array.prototype.slice.call(arguments);
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

            var args = Array.prototype.slice.call(arguments);
            var lastArg = args.slice(-1)[0];
            var done = lastArg instanceof Function ? lastArg : null;
            var startPath = undefined,
                startState = undefined;

            if (this.started) {
                if (done) done({ code: _constants2['default'].ROUTER_ALREADY_STARTED });
                return this;
            }

            this.started = true;
            this._invokeListeners('$start');
            var opts = this.options;

            if (args.length > 0) {
                if (typeof args[0] === 'string') startPath = args[0];
                if (typeof args[0] === 'object') startState = args[0];
            }

            // callback
            var cb = function cb(err, state) {
                var invokeErrCb = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

                if (done) done(err, state);
                if (!err) _this3._invokeListeners('$$success', state, null, { replace: true });
                if (err && invokeErrCb) _this3._invokeListeners('$$error', state, null, err);
            };

            // Get start path
            if (startPath === undefined && startState === undefined && this.getLocation) {
                startPath = this.getLocation();
            }

            if (!startState) {
                (function () {
                    // If no supplied start state, get start state
                    startState = startPath === undefined ? null : _this3.matchPath(startPath);
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
                                cb(null, state);
                            } else if (opts.defaultRoute) navigateToDefault();else cb(err, null, false);
                        });
                    } else if (opts.defaultRoute) {
                        // If default, navigate to default
                        navigateToDefault();
                    } else {
                        // No start match, no default => do nothing
                        cb({ code: _constants2['default'].ROUTE_NOT_FOUND, path: startPath }, null);
                    }
                })();
            } else {
                // Initialise router with provided start state
                this.lastKnownState = startState;
                cb(null, startState);
            }

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
            this._invokeListeners('$stop');

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
         * @param  {Boolean}  [strictEquality=false] If set to false (default), isActive will return true
         *                                           if the provided route name and params are descendants
         *                                           of the active state.
         * @param  {Boolean}   [ignoreQueryParams=true] Whether or not to ignore URL query parameters when
         *                                              comparing the two states together.
         *                                              query parameters when comparing two states together.
         * @return {Boolean}                    Whether nor not the route is active
         */
    }, {
        key: 'isActive',
        value: function isActive(name) {
            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var strictEquality = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var ignoreQueryParams = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

            var activeState = this.getState();

            if (!activeState) return false;

            if (strictEquality || activeState.name === name) {
                return this.areStatesEqual(makeState(name, params), activeState, ignoreQueryParams);
            }

            return this.areStatesDescendants(makeState(name, params), activeState);
        }

        /**
         * @private
         */
    }, {
        key: 'areStatesEqual',
        value: function areStatesEqual(state1, state2) {
            var _this4 = this;

            var ignoreQueryParams = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            if (state1.name !== state2.name) return false;

            var getUrlParams = function getUrlParams(name) {
                return _this4.rootNode.getSegmentsByName(name).map(function (segment) {
                    return segment.parser[ignoreQueryParams ? 'urlParams' : 'params'];
                }).reduce(function (params, p) {
                    return params.concat(p);
                }, []);
            };

            var state1Params = getUrlParams(state1.name);
            var state2Params = getUrlParams(state2.name);

            return state1Params.length === state2Params.length && state1Params.every(function (p) {
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
            this._cbs[name] = (this._cbs[name] || []).concat(cb);
            return this;
        }

        /**
         * Register an active component for a specific route segment
         * @param  {String} name      The route segment full name
         * @param  {Object} component The component instance
         */
    }, {
        key: 'registerComponent',
        value: function registerComponent(name, component) {
            var warn = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            if (this._cmps[name] && warn) console.warn('A component was alread registered for route node ' + name + '.');
            this._cmps[name] = component;
            return this;
        }

        /**
         * Update the "canDeactivate" status.
         * @param  {String}  name          The route segment full name
         * @param  {Boolean} canDeactivate Whether the segment can be deactivated or not
         * @return {[type]}               [description]
         */
    }, {
        key: 'canDeactivate',
        value: function canDeactivate(name, _canDeactivate) {
            if (!this.options.autoCleanUp) throw new Error('[router.canDeactivate()] Cannot be used if "autoCleanUp" is set to false');
            this.registerComponent(name, { canDeactivate: function canDeactivate(toState, fromState) {
                    return _canDeactivate;
                } }, false);
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
            this._cmps[name] = undefined;
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
         * Generates an URL from a route name and route params.
         * The generated URL will be prefixed by hash if useHash is set to true
         * @param  {String} route  The route name
         * @param  {Object} params The route params (key-value pairs)
         * @return {String}        The built URL
         */
    }, {
        key: 'buildUrl',
        value: function buildUrl(route, params) {
            return this._buildUrl(this.buildPath(route, params));
        }

        /**
         * @private
         */
    }, {
        key: '_buildUrl',
        value: function _buildUrl(path) {
            return (this.options.base || '') + (this.options.useHash ? '#' + this.options.hashPrefix : '') + path;
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

            var pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);

            if (!pathParts) throw new Error('[router5] Could not parse url ' + url);

            var pathname = pathParts[1];
            var hash = pathParts[2] || '';
            var search = pathParts[3] || '';
            var opts = this.options;

            return (opts.useHash ? hash.replace(new RegExp('^#' + opts.hashPrefix), '') : opts.base ? pathname.replace(new RegExp('^' + opts.base), '') : pathname) + search;
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
            var _this5 = this;

            // Cancel current transition
            if (this._tr) this._tr();
            this._invokeListeners('$$start', toState, fromState);

            var tr = (0, _transition2.transition)(this, toState, fromState, function (err) {
                _this5._tr = null;

                if (err) {
                    if (err.code === _constants2['default'].TRANSITION_CANCELLED) _this5._invokeListeners('$$cancel', toState, fromState);else _this5._invokeListeners('$$error', toState, fromState, err);

                    if (done) done(err);
                    return;
                }

                _this5.lastKnownState = toState;

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

            var _this6 = this;

            if (opts === undefined) opts = {};

            if (!this.started) {
                if (done) done({ code: _constants2['default'].ROUTER_NOT_STARTED });
                return;
            }

            var path = this.buildPath(name, params);

            if (!path) {
                var err = { code: _constants2['default'].ROUTE_NOT_FOUND };
                if (done) done(err);
                this._invokeListeners('$$error', null, this.lastKnownState, err);
                return;
            }

            var toState = makeState(name, params, path);
            this.lastStateAttempt = toState;
            var sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt, false) : false;

            // Do not proceed further if states are the same and no reload
            // (no desactivation and no callbacks)
            if (sameStates && !opts.reload) {
                var err = { code: _constants2['default'].SAME_STATES };
                if (done) done(err);
                this._invokeListeners('$$error', toState, this.lastKnownState, err);
                return;
            }

            var fromState = sameStates ? null : this.lastKnownState;

            // Transition and amend history
            return this._transition(toState, sameStates ? null : this.lastKnownState, function (err, state) {
                if (err) {
                    if (done) done(err);
                    return;
                }

                _this6._invokeListeners('$$success', toState, fromState, opts);
                if (done) done(null, state);
            });
        }
    }]);

    return Router5;
})();

Router5.ERR = _constants2['default'];

/**
 * An helper function to return instructions for a transition:
 * intersection route name, route names to deactivate, route names to activate
 * @param  {Object} toState   The state to go to
 * @param  {Object} fromState The state to go from
 * @return {Object}           An object containing 'intersection', 'toActivate' and 'toDeactivate' keys
 */
Router5.transitionPath = _transition2.transitionPath;

Router5.loggerPlugin = _logger2['default'];

exports['default'] = Router5;
module.exports = exports['default'];