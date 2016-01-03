(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["router5"] = factory();
	else
		root["router5"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.RouteNode = exports.Router5 = undefined;

	var _router = __webpack_require__(1);

	var _router2 = _interopRequireDefault(_router);

	var _routeNode = __webpack_require__(2);

	var _routeNode2 = _interopRequireDefault(_routeNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Router5 = _router2.default;
	exports.RouteNode = _routeNode2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _routeNode = __webpack_require__(2);

	var _routeNode2 = _interopRequireDefault(_routeNode);

	var _router = __webpack_require__(4);

	var _router2 = _interopRequireDefault(_router);

	var _transition2 = __webpack_require__(5);

	var _transition3 = _interopRequireDefault(_transition2);

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	var _logger = __webpack_require__(8);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var noop = function noop() {};

	var makeState = function makeState(name, params, path, _meta) {
	    var state = {};
	    var setProp = function setProp(key, value) {
	        return Object.defineProperty(state, key, { value: value, enumerable: true });
	    };
	    setProp('name', name);
	    setProp('params', params);
	    setProp('path', path);
	    if (_meta) setProp('_meta', _meta);
	    return state;
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
	        this.rootNode = routes instanceof _routeNode2.default ? routes : new _routeNode2.default('', '', routes);
	        this.options = {
	            useHash: false,
	            hashPrefix: '',
	            base: false,
	            trailingSlash: 0,
	            autoCleanUp: true,
	            strictQueryParams: true
	        };
	        Object.keys(opts).forEach(function (opt) {
	            return _this.options[opt] = opts[opt];
	        });
	        this.registeredPlugins = {};
	        this._extraArgs = [];
	    }

	    /**
	     * Set an option value
	     * @param  {String} opt The option to set
	     * @param  {*}      val The option value
	     * @return {Router5}    The Router5 instance
	     */

	    Router5.prototype.setOption = function setOption(opt, val) {
	        this.options[opt] = val;
	        return this;
	    };

	    /**
	     * Set additional arguments used in lifecycle functions.
	     * Additional arguments are used in canActivate and canDeactivate in first positions (before `toState`).
	     * @param  {Array} args The additional arguments
	     */

	    Router5.prototype.setAdditionalArgs = function setAdditionalArgs(args) {
	        this._extraArgs = Array.isArray(args) ? args : [args];
	        return this;
	    };

	    /**
	     * Return additional arguments used in lifecycle functions
	     */

	    Router5.prototype.getAdditionalArgs = function getAdditionalArgs() {
	        return this._extraArgs;
	    };

	    /**
	     * Add route(s)
	     * @param  {RouteNode[]|Object[]|RouteNode|Object} routes Route(s) to add
	     * @return {Router5}  The Router5 instance
	     */

	    Router5.prototype.add = function add(routes) {
	        this.rootNode.add(routes);
	        return this;
	    };

	    /**
	     * Add a route to the router.
	     * @param {String}   name          The route name
	     * @param {String}   path          The route path
	     * @param {Function} [canActivate] A function to determine if the route can be activated.
	     *                                 It will be invoked during a transition with `toState`
	     *                                 and `fromState` parameters.
	     * @return {Router5}             The Router5 instance
	     */

	    Router5.prototype.addNode = function addNode(name, path, canActivate) {
	        this.rootNode.addNode(name, path);
	        if (canActivate) this._canAct[name] = canActivate;
	        return this;
	    };

	    Router5.prototype.usePlugin = function usePlugin(plugin) {
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
	    };

	    /**
	     * Set a transition middleware function `.useMiddleware(fn1, fn2, fn3, ...)`
	     * @param {Function} fn The middleware function
	     */

	    Router5.prototype.useMiddleware = function useMiddleware() {
	        this.mware = Array.prototype.slice.call(arguments);
	        return this;
	    };

	    /**
	     * Start the router
	     * @param  {String|Object} [startPathOrState] An optional start path or state
	     *                                            (use it for universal applications)
	     * @param  {Function}      [done]             An optional callback which will be called
	     *                                            when starting is done
	     * @return {Router5}  The router instance
	     */

	    Router5.prototype.start = function start() {
	        var _this3 = this;

	        var args = Array.prototype.slice.call(arguments);
	        var lastArg = args.slice(-1)[0];
	        var done = lastArg instanceof Function ? lastArg : noop;
	        var startPath = undefined,
	            startState = undefined;

	        if (this.started) {
	            done({ code: _constants2.default.ROUTER_ALREADY_STARTED });
	            return this;
	        }

	        this.started = true;
	        this._invokeListeners('$start');
	        var opts = this.options;

	        if (args.length > 0) {
	            if (typeof args[0] === 'string') startPath = args[0];
	            if (_typeof(args[0]) === 'object') startState = args[0];
	        }

	        // callback
	        var cb = function cb(err, state) {
	            var invokeErrCb = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	            done(err, state);
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
	                        return done(err, state);
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
	                    cb({ code: _constants2.default.ROUTE_NOT_FOUND, path: startPath }, null);
	                }
	            })();
	        } else {
	            // Initialise router with provided start state
	            this.lastKnownState = startState;
	            cb(null, startState);
	        }

	        return this;
	    };

	    /**
	     * Stop the router
	     * @return {Router5} The router instance
	     */

	    Router5.prototype.stop = function stop() {
	        if (!this.started) return this;
	        this.lastKnownState = null;
	        this.lastStateAttempt = null;
	        this.started = false;
	        this._invokeListeners('$stop');

	        return this;
	    };

	    /**
	     * Return the current state object
	     * @return {Object} The current state
	     */

	    Router5.prototype.getState = function getState() {
	        return this.lastKnownState;
	    };

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

	    Router5.prototype.isActive = function isActive(name) {
	        var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	        var strictEquality = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	        var ignoreQueryParams = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	        var activeState = this.getState();

	        if (!activeState) return false;

	        if (strictEquality || activeState.name === name) {
	            return this.areStatesEqual(makeState(name, params), activeState, ignoreQueryParams);
	        }

	        return this.areStatesDescendants(makeState(name, params), activeState);
	    };

	    /**
	     * @private
	     */

	    Router5.prototype.areStatesEqual = function areStatesEqual(state1, state2) {
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
	    };

	    /**
	     * Whether two states are descendants
	     * @param  {Object} parentState The parent state
	     * @param  {Object} childState  The child state
	     * @return {Boolean}            Whether the two provided states are related
	     */

	    Router5.prototype.areStatesDescendants = function areStatesDescendants(parentState, childState) {
	        var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
	        if (!regex.test(childState.name)) return false;
	        // If child state name extends parent state name, and all parent state params
	        // are in child state params.
	        return Object.keys(parentState.params).every(function (p) {
	            return parentState.params[p] === childState.params[p];
	        });
	    };

	    /**
	     * @private
	     */

	    Router5.prototype._invokeListeners = function _invokeListeners(name) {
	        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            args[_key - 1] = arguments[_key];
	        }

	        (this._cbs[name] || []).forEach(function (cb) {
	            return cb.apply(undefined, args);
	        });
	    };

	    /**
	     * @private
	     */

	    Router5.prototype._addListener = function _addListener(name, cb, replace) {
	        this._cbs[name] = (this._cbs[name] || []).concat(cb);
	        return this;
	    };

	    /**
	     * Register an active component for a specific route segment
	     * @param  {String} name      The route segment full name
	     * @param  {Object} component The component instance
	     */

	    Router5.prototype.registerComponent = function registerComponent(name, component) {
	        var warn = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	        if (this._cmps[name] && warn) console.warn('A component was alread registered for route node ' + name + '.');
	        this._cmps[name] = component;
	        return this;
	    };

	    /**
	     * Shortcut to "registerComponent". It updates the "canDeactivate" status of a route segment.
	     * @param  {String}  name          The route segment full name
	     * @param  {Boolean} canDeactivate Whether the segment can be deactivated or not
	     * @return {[type]}
	     */

	    Router5.prototype.canDeactivate = function canDeactivate(name, _canDeactivate) {
	        if (!this.options.autoCleanUp) throw new Error('[router.canDeactivate()] Cannot be used if "autoCleanUp" is set to false');
	        this.registerComponent(name, { canDeactivate: function canDeactivate(toState, fromState) {
	                return _canDeactivate;
	            } }, false);
	        return this;
	    };

	    /**
	     * Deregister an active component
	     * @param  {String} name The route segment full name
	     * @return {Router5} The router instance
	     */

	    Router5.prototype.deregisterComponent = function deregisterComponent(name) {
	        this._cmps[name] = undefined;
	    };

	    /**
	     * A function to determine whether or not a segment can be activated.
	     * @param  {String}   name        The route name to register the canActivate method for
	     * @param  {Function} canActivate The canActivate function. It should return `true`, `false`
	     *                                or a promise
	     * @return {Router5}  The router instance
	     */

	    Router5.prototype.canActivate = function canActivate(name, _canActivate) {
	        this._canAct[name] = _canActivate;
	        return this;
	    };

	    /**
	     * Generates an URL from a route name and route params.
	     * The generated URL will be prefixed by hash if useHash is set to true
	     * @param  {String} route  The route name
	     * @param  {Object} params The route params (key-value pairs)
	     * @return {String}        The built URL
	     */

	    Router5.prototype.buildUrl = function buildUrl(route, params) {
	        return this._buildUrl(this.buildPath(route, params));
	    };

	    /**
	     * @private
	     */

	    Router5.prototype._buildUrl = function _buildUrl(path) {
	        return (this.options.base || '') + (this.options.useHash ? '#' + this.options.hashPrefix : '') + path;
	    };

	    /**
	     * Build a path from a route name and route params
	     * The generated URL will be prefixed by hash if useHash is set to true
	     * @param  {String} route  The route name
	     * @param  {Object} params The route params (key-value pairs)
	     * @return {String}        The built Path
	     */

	    Router5.prototype.buildPath = function buildPath(route, params) {
	        return this.rootNode.buildPath(route, params);
	    };

	    /**
	     * Build a state object from a route name and route params
	     * @param  {String} route  The route name
	     * @param  {Object} params The route params (key-value pairs)
	     * @return {String}        The built Path
	     */

	    Router5.prototype.buildState = function buildState(route, params) {
	        return this.rootNode.buildState(route, params);
	    };

	    /**
	     * Match a path against the route tree.
	     * @param  {String} path   The path to match
	     * @return {Object}        The matched state object (null if no match)
	     */

	    Router5.prototype.matchPath = function matchPath(path) {
	        var _options = this.options;
	        var trailingSlash = _options.trailingSlash;
	        var strictQueryParams = _options.strictQueryParams;

	        var match = this.rootNode.matchPath(path, { trailingSlash: trailingSlash, strictQueryParams: strictQueryParams });
	        return match ? makeState(match.name, match.params, path, match._meta) : null;
	    };

	    /**
	     * Parse / extract a path from an url
	     * @param  {String} url The URL
	     * @return {String}     The extracted path
	     */

	    Router5.prototype.urlToPath = function urlToPath(url) {
	        var match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
	        var path = match ? match[1] : url;

	        var pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);

	        if (!pathParts) throw new Error('[router5] Could not parse url ' + url);

	        var pathname = pathParts[1];
	        var hash = pathParts[2] || '';
	        var search = pathParts[3] || '';
	        var opts = this.options;

	        return (opts.useHash ? hash.replace(new RegExp('^#' + opts.hashPrefix), '') : opts.base ? pathname.replace(new RegExp('^' + opts.base), '') : pathname) + search;
	    };

	    /**
	     * Parse path from an url and match it against the route tree.
	     * @param  {String} url    The URL to match
	     * @return {Object}        The matched state object (null if no match)
	     */

	    Router5.prototype.matchUrl = function matchUrl(url) {
	        return this.matchPath(this.urlToPath(url));
	    };

	    /**
	     * @private
	     */

	    Router5.prototype._transition = function _transition(toState, fromState) {
	        var _this5 = this;

	        var done = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

	        // Cancel current transition
	        this.cancel();
	        this._invokeListeners('$$start', toState, fromState);

	        var tr = (0, _transition3.default)(this, toState, fromState, function (err, state) {
	            state = state || toState;
	            _this5._tr = null;

	            if (err) {
	                if (err.code === _constants2.default.TRANSITION_CANCELLED) _this5._invokeListeners('$$cancel', toState, fromState);else _this5._invokeListeners('$$error', toState, fromState, err);

	                done(err);
	                return;
	            }

	            _this5.lastKnownState = state; // toState or modified state?

	            done(null, state);
	        });

	        this._tr = tr;
	        return function () {
	            return !tr || tr();
	        };
	    };

	    /**
	     * Undocumented for now
	     * @private
	     */

	    Router5.prototype.cancel = function cancel() {
	        if (this._tr) this._tr();
	    };

	    /**
	     * Navigate to a specific route
	     * @param  {String}   name        The route name
	     * @param  {Object}   [params={}] The route params
	     * @param  {Object}   [opts={}]   The route options (replace, reload)
	     * @param  {Function} done        A optional callback(err) to call when transition has been performed
	     *                                either successfully or unsuccessfully.
	     * @return {Function}             A cancellation function
	     */

	    Router5.prototype.navigate = function navigate(name) {
	        var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        var _this6 = this;

	        var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	        var done = arguments.length <= 3 || arguments[3] === undefined ? noop : arguments[3];

	        if (!this.started) {
	            done({ code: _constants2.default.ROUTER_NOT_STARTED });
	            return;
	        }

	        var toState = this.buildState(name, params);

	        if (!toState) {
	            var err = { code: _constants2.default.ROUTE_NOT_FOUND };
	            done(err);
	            this._invokeListeners('$$error', null, this.lastKnownState, err);
	            return;
	        }

	        toState.path = this.buildPath(name, params);
	        this.lastStateAttempt = toState;
	        var sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt, false) : false;

	        // Do not proceed further if states are the same and no reload
	        // (no desactivation and no callbacks)
	        if (sameStates && !opts.reload) {
	            var err = { code: _constants2.default.SAME_STATES };
	            done(err);
	            this._invokeListeners('$$error', toState, this.lastKnownState, err);
	            return;
	        }

	        var fromState = sameStates ? null : this.lastKnownState;

	        // Transition and amend history
	        return this._transition(toState, sameStates ? null : this.lastKnownState, function (err, state) {
	            if (err) {
	                done(err);
	                return;
	            }

	            _this6._invokeListeners('$$success', toState, fromState, opts);
	            done(null, state);
	        });
	    };

	    return Router5;
	})();

	/**
	 * Error codes
	 * @static
	 * @type {Object}
	 */

	Router5.ERR = _constants2.default;

	/**
	 * An helper function to return instructions for a transition:
	 * intersection route name, route names to deactivate, route names to activate
	 * @static
	 * @param  {Object} toState   The state to go to
	 * @param  {Object} fromState The state to go from
	 * @return {Object}           An object containing 'intersection', 'toActivate' and 'toDeactivate' keys
	 */
	Router5.transitionPath = _router2.default;

	Router5.loggerPlugin = _logger2.default;

	exports.default = Router5;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _pathParser = __webpack_require__(3);

	var _pathParser2 = _interopRequireDefault(_pathParser);

	var isSerialisable = function isSerialisable(val) {
	    return val !== undefined && val !== null && val !== '';
	};

	var removeQueryParamsFromPath = function removeQueryParamsFromPath(path, params) {
	    if (path.indexOf('?') === -1) return path;
	    var splitPath = path.split('?');
	    var pathPart = splitPath[0];
	    var searchPart = splitPath[1];

	    var remainingSearchParams = searchPart.split('&').reduce(function (obj, p) {
	        var splitParam = p.split('=');
	        var key = splitParam[0];
	        var val = decodeURIComponent(splitParam[1]);
	        if (params.indexOf(key) === -1) obj[key] = val || '';
	        return obj;
	    }, {});

	    var remainingSearchPart = Object.keys(remainingSearchParams).map(function (p) {
	        return [p].concat(isSerialisable(remainingSearchParams[p]) ? encodeURIComponent(remainingSearchParams[p]) : []);
	    }).map(function (p) {
	        return p.join('=');
	    }).join('&');

	    return pathPart + (remainingSearchPart ? '?' + remainingSearchPart : '');
	};

	var RouteNode = (function () {
	    function RouteNode() {
	        var name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	        var path = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	        var childRoutes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

	        _classCallCheck(this, RouteNode);

	        this.name = name;
	        this.path = path;
	        this.parser = path ? new _pathParser2['default'](path) : null;
	        this.children = [];

	        this.add(childRoutes);

	        return this;
	    }

	    _createClass(RouteNode, [{
	        key: 'add',
	        value: function add(route) {
	            var _this = this;

	            if (route === undefined || route === null) return;

	            if (route instanceof Array) {
	                route.forEach(function (r) {
	                    return _this.add(r);
	                });
	                return;
	            }

	            if (!(route instanceof RouteNode) && !(route instanceof Object)) {
	                throw new Error('RouteNode.add() expects routes to be an Object or an instance of RouteNode.');
	            }
	            if (route instanceof Object) {
	                if (!route.name || !route.path) {
	                    throw new Error('RouteNode.add() expects routes to have a name and a path defined.');
	                }
	                route = new RouteNode(route.name, route.path, route.children);
	            }
	            // Check duplicated routes
	            if (this.children.map(function (child) {
	                return child.name;
	            }).indexOf(route.name) !== -1) {
	                throw new Error('Alias "' + route.name + '" is already defined in route node');
	            }
	            // Check duplicated paths
	            if (this.children.map(function (child) {
	                return child.path;
	            }).indexOf(route.path) !== -1) {
	                throw new Error('Path "' + route.path + '" is already defined in route node');
	            }

	            var names = route.name.split('.');

	            if (names.length === 1) {
	                this.children.push(route);
	                // Push greedy spats to the bottom of the pile
	                this.children.sort(function (a, b) {
	                    // '/' last
	                    if (a.path === '/') return 1;
	                    if (b.path === '/') return -1;
	                    var aHasParams = a.parser.hasUrlParams || a.parser.hasSpatParam;
	                    var bHasParams = b.parser.hasUrlParams || b.parser.hasSpatParam;
	                    // No params first, sort by length descending
	                    if (!aHasParams && !bHasParams) {
	                        return a.path && b.path ? a.path.length < b.path.length ? 1 : -1 : 0;
	                    }
	                    // Params last
	                    if (aHasParams && !bHasParams) return 1;
	                    if (!aHasParams && bHasParams) return -1;
	                    // Spat params last
	                    if (!a.parser.hasSpatParam && b.parser.hasSpatParam) return -1;
	                    if (!b.parser.hasSpatParam && a.parser.hasSpatParam) return 1;
	                    // Sort by number of segments descending
	                    var aSegments = (a.path.match(/\//g) || []).length;
	                    var bSegments = (b.path.match(/\//g) || []).length;
	                    if (aSegments < bSegments) return 1;
	                    return 0;
	                });
	            } else {
	                // Locate parent node
	                var segments = this.getSegmentsByName(names.slice(0, -1).join('.'));
	                if (segments) {
	                    segments[segments.length - 1].add(new RouteNode(names[names.length - 1], route.path, route.children));
	                } else {
	                    throw new Error('Could not add route named \'' + route.name + '\', parent is missing.');
	                }
	            }

	            return this;
	        }
	    }, {
	        key: 'addNode',
	        value: function addNode(name, params) {
	            this.add(new RouteNode(name, params));
	            return this;
	        }
	    }, {
	        key: 'getSegmentsByName',
	        value: function getSegmentsByName(routeName) {
	            var findSegmentByName = function findSegmentByName(name, routes) {
	                var filteredRoutes = routes.filter(function (r) {
	                    return r.name === name;
	                });
	                return filteredRoutes.length ? filteredRoutes[0] : undefined;
	            };
	            var segments = [];
	            var names = routeName.split('.');
	            var routes = this.children;

	            var matched = names.every(function (name) {
	                var segment = findSegmentByName(name, routes);
	                if (segment) {
	                    routes = segment.children;
	                    segments.push(segment);
	                    return true;
	                }
	                return false;
	            });

	            return matched ? segments : null;
	        }
	    }, {
	        key: 'getSegmentsMatchingPath',
	        value: function getSegmentsMatchingPath(path, options) {
	            var trailingSlash = options.trailingSlash;
	            var strictQueryParams = options.strictQueryParams;

	            var matchChildren = function matchChildren(nodes, pathSegment, segments) {
	                var _loop = function (i) {
	                    var child = nodes[i];
	                    // Partially match path
	                    var match = child.parser.partialMatch(pathSegment);
	                    var remainingPath = undefined,
	                        remainingSearch = undefined;

	                    if (!match && trailingSlash) {
	                        // Try with optional trailing slash
	                        match = child.parser.match(pathSegment, true);
	                        remainingPath = '';
	                    } else if (match) {
	                        // Remove consumed segment from path
	                        var consumedPath = child.parser.build(match, { ignoreSearch: true });
	                        remainingPath = removeQueryParamsFromPath(pathSegment.replace(consumedPath, ''), child.parser.queryParams);

	                        if (trailingSlash && remainingPath === '/' && !/\/$/.test(consumedPath)) {
	                            remainingPath = '';
	                        }
	                    }

	                    if (match) {
	                        segments.push(child);
	                        Object.keys(match).forEach(function (param) {
	                            return segments.params[param] = match[param];
	                        });

	                        if (!remainingPath.length || // fully matched
	                        !strictQueryParams && remainingPath.indexOf('?') === 0 // unmatched queryParams in non strict mode
	                        ) {
	                                return {
	                                    v: segments
	                                };
	                            }
	                        // If no children to match against but unmatched path left
	                        if (!child.children.length) {
	                            return {
	                                v: null
	                            };
	                        }
	                        // Else: remaining path and children
	                        return {
	                            v: matchChildren(child.children, remainingPath, segments)
	                        };
	                    }
	                };

	                // for (child of node.children) {
	                for (var i in nodes) {
	                    var _ret = _loop(i);

	                    if (typeof _ret === 'object') return _ret.v;
	                }
	                return null;
	            };

	            var startingNodes = this.parser ? [this] : this.children;
	            var segments = [];
	            segments.params = {};

	            return matchChildren(startingNodes, path, segments);
	        }
	    }, {
	        key: 'getPathFromSegments',
	        value: function getPathFromSegments(segments) {
	            return segments ? segments.map(function (segment) {
	                return segment.path;
	            }).join('') : null;
	        }
	    }, {
	        key: 'getPath',
	        value: function getPath(routeName) {
	            return this.getPathFromSegments(this.getSegmentsByName(routeName));
	        }
	    }, {
	        key: 'buildPathFromSegments',
	        value: function buildPathFromSegments(segments) {
	            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (!segments) return null;

	            var searchParams = segments.filter(function (s) {
	                return s.parser.hasQueryParams;
	            }).map(function (s) {
	                return s.parser.queryParams;
	            });

	            var searchPart = !searchParams.length ? null : searchParams.reduce(function (queryParams, params) {
	                return queryParams.concat(params);
	            }).filter(function (p) {
	                return Object.keys(params).indexOf(p) !== -1;
	            }).map(function (p) {
	                return _pathParser2['default'].serialise(p, params[p]);
	            }).join('&');

	            return segments.map(function (segment) {
	                return segment.parser.build(params, { ignoreSearch: true });
	            }).join('') + (searchPart ? '?' + searchPart : '');
	        }
	    }, {
	        key: 'getMetaFromSegments',
	        value: function getMetaFromSegments(segments) {
	            var accName = '';

	            return segments.reduce(function (meta, segment, i) {
	                var urlParams = segment.parser.urlParams.reduce(function (params, p) {
	                    params[p] = 'url';
	                    return params;
	                }, {});

	                var allParams = segment.parser.queryParams.reduce(function (params, p) {
	                    params[p] = 'query';
	                    return params;
	                }, urlParams);

	                accName = accName ? accName + '.' + segment.name : segment.name;
	                meta[accName] = allParams;
	                return meta;
	            }, {});
	        }
	    }, {
	        key: 'buildPath',
	        value: function buildPath(routeName) {
	            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            return this.buildPathFromSegments(this.getSegmentsByName(routeName), params);
	        }
	    }, {
	        key: 'buildStateFromSegments',
	        value: function buildStateFromSegments(segments) {
	            if (!segments || !segments.length) return null;

	            var name = segments.map(function (segment) {
	                return segment.name;
	            }).join('.');
	            var params = segments.params;

	            return {
	                name: name,
	                params: params,
	                _meta: this.getMetaFromSegments(segments)
	            };
	        }
	    }, {
	        key: 'buildState',
	        value: function buildState(name) {
	            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            var segments = this.getSegmentsByName(name);
	            if (!segments || !segments.length) return null;

	            return {
	                name: name,
	                params: params,
	                _meta: this.getMetaFromSegments(segments)
	            };
	        }
	    }, {
	        key: 'matchPath',
	        value: function matchPath(path, options) {
	            var defaultOptions = { trailingSlash: false, strictQueryParams: true };
	            options = _extends({}, defaultOptions, options);
	            return this.buildStateFromSegments(this.getSegmentsMatchingPath(path, options));
	        }
	    }]);

	    return RouteNode;
	})();

	exports['default'] = RouteNode;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var defaultOrConstrained = function defaultOrConstrained(match) {
	    return '(' + (match ? match.replace(/(^<|>$)/g, '') : '[a-zA-Z0-9-_.~]+') + ')';
	};

	var rules = [{
	    // An URL can contain a parameter :paramName
	    // - and _ are allowed but not in last position
	    name: 'url-parameter',
	    pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
	    regex: function regex(match) {
	        return new RegExp(defaultOrConstrained(match[2]));
	    }
	}, {
	    // Url parameter (splat)
	    name: 'url-parameter-splat',
	    pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
	    regex: /([^\?]*)/
	}, {
	    name: 'url-parameter-matrix',
	    pattern: /^\;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
	    regex: function regex(match) {
	        return new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]));
	    }
	}, {
	    // Query parameter: ?param1&param2
	    //                   ?:param1&:param2
	    name: 'query-parameter',
	    pattern: /^(?:\?|&)(?:\:)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
	}, // regex:   match => new RegExp('(?=(\?|.*&)' + match[0] + '(?=(\=|&|$)))')
	{
	    // Delimiter /
	    name: 'delimiter',
	    pattern: /^(\/|\?)/,
	    regex: function regex(match) {
	        return new RegExp('\\' + match[0]);
	    }
	}, {
	    // Sub delimiters
	    name: 'sub-delimiter',
	    pattern: /^(\!|\&|\-|_|\.|;)/,
	    regex: function regex(match) {
	        return new RegExp(match[0]);
	    }
	}, {
	    // Unmatched fragment (until delimiter is found)
	    name: 'fragment',
	    pattern: /^([0-9a-zA-Z]+?)/,
	    regex: function regex(match) {
	        return new RegExp(match[0]);
	    }
	}];

	var tokenise = function tokenise(str) {
	    var tokens = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	    // Look for a matching rule
	    var matched = rules.some(function (rule) {
	        var match = str.match(rule.pattern);
	        if (!match) return false;

	        tokens.push({
	            type: rule.name,
	            match: match[0],
	            val: match.slice(1, 2),
	            otherVal: match.slice(2),
	            regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
	        });

	        if (match[0].length < str.length) tokens = tokenise(str.substr(match[0].length), tokens);
	        return true;
	    });
	    // If no rules matched, throw an error (possible malformed path)
	    if (!matched) {
	        throw new Error('Could not parse path.');
	    }
	    // Return tokens
	    return tokens;
	};

	var optTrailingSlash = function optTrailingSlash(source, trailingSlash) {
	    if (!trailingSlash) return source;
	    return source.replace(/\\\/$/, '') + '(?:\\/)?';
	};

	var appendQueryParam = function appendQueryParam(params, param) {
	    var val = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

	    var existingVal = params[param];

	    if (existingVal === undefined) params[param] = val;else params[param] = Array.isArray(existingVal) ? existingVal.concat(val) : [existingVal, val];

	    return params;
	};

	var parseQueryParams = function parseQueryParams(path) {
	    var searchPart = path.split('?')[1];
	    if (!searchPart) return {};
	    return searchPart.split('&').map(function (_) {
	        return _.split('=');
	    }).reduce(function (obj, m) {
	        return appendQueryParam(obj, m[0], m[1] ? decodeURIComponent(m[1]) : m[1]);
	    }, {});
	};

	var toSerialisable = function toSerialisable(val) {
	    return val !== undefined && val !== null && val !== '' ? '=' + encodeURIComponent(val) : '';
	};

	var _serialise = function _serialise(key, val) {
	    return Array.isArray(val) ? val.map(function (v) {
	        return _serialise(key, v);
	    }).join('&') : key + toSerialisable(val);
	};

	var Path = (function () {
	    _createClass(Path, null, [{
	        key: 'createPath',
	        value: function createPath(path) {
	            return new Path(path);
	        }
	    }, {
	        key: 'serialise',
	        value: function serialise(key, val) {
	            return _serialise(key, val);
	        }
	    }]);

	    function Path(path) {
	        _classCallCheck(this, Path);

	        if (!path) throw new Error('Please supply a path');
	        this.path = path;
	        this.tokens = tokenise(path);

	        this.hasUrlParams = this.tokens.filter(function (t) {
	            return (/^url-parameter/.test(t.type)
	            );
	        }).length > 0;
	        this.hasSpatParam = this.tokens.filter(function (t) {
	            return (/splat$/.test(t.type)
	            );
	        }).length > 0;
	        this.hasMatrixParams = this.tokens.filter(function (t) {
	            return (/matrix$/.test(t.type)
	            );
	        }).length > 0;
	        this.hasQueryParams = this.tokens.filter(function (t) {
	            return t.type === 'query-parameter';
	        }).length > 0;
	        // Extract named parameters from tokens
	        this.urlParams = !this.hasUrlParams ? [] : this.tokens.filter(function (t) {
	            return (/^url-parameter/.test(t.type)
	            );
	        }).map(function (t) {
	            return t.val.slice(0, 1);
	        })
	        // Flatten
	        .reduce(function (r, v) {
	            return r.concat(v);
	        });
	        // Query params
	        this.queryParams = !this.hasQueryParams ? [] : this.tokens.filter(function (t) {
	            return t.type === 'query-parameter';
	        }).map(function (t) {
	            return t.val;
	        })
	        // Flatten
	        .reduce(function (r, v) {
	            return r.concat(v);
	        });
	        this.params = this.urlParams.concat(this.queryParams);
	        // Check if hasQueryParams
	        // Regular expressions for url part only (full and partial match)
	        this.source = this.tokens.filter(function (t) {
	            return t.regex !== undefined;
	        }).map(function (r) {
	            return r.regex.source;
	        }).join('');
	    }

	    _createClass(Path, [{
	        key: '_urlMatch',
	        value: function _urlMatch(path, regex) {
	            var _this = this;

	            var match = path.match(regex);
	            if (!match) return null;else if (!this.urlParams.length) return {};
	            // Reduce named params to key-value pairs
	            return match.slice(1, this.urlParams.length + 1).reduce(function (params, m, i) {
	                params[_this.urlParams[i]] = m;
	                return params;
	            }, {});
	        }
	    }, {
	        key: 'match',
	        value: function match(path) {
	            var _this2 = this;

	            var trailingSlash = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	            // trailingSlash: falsy => non optional, truthy => optional
	            var source = optTrailingSlash(this.source, trailingSlash);
	            // Check if exact match
	            var match = this._urlMatch(path, new RegExp('^' + source + (this.hasQueryParams ? '\\?.*$' : '$')));
	            // If no match, or no query params, no need to go further
	            if (!match || !this.hasQueryParams) return match;
	            // Extract query params
	            var queryParams = parseQueryParams(path);
	            var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) {
	                return _this2.queryParams.indexOf(p) === -1;
	            });

	            if (unexpectedQueryParams.length === 0) {
	                // Extend url match
	                Object.keys(queryParams).forEach(function (p) {
	                    return match[p] = queryParams[p];
	                });

	                return match;
	            }

	            return null;
	        }
	    }, {
	        key: 'partialMatch',
	        value: function partialMatch(path) {
	            var _this3 = this;

	            var trailingSlash = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	            // Check if partial match (start of given path matches regex)
	            // trailingSlash: falsy => non optional, truthy => optional
	            var source = optTrailingSlash(this.source, trailingSlash);
	            var match = this._urlMatch(path, new RegExp('^' + source));

	            if (!match) return match;

	            if (!this.hasQueryParams) return match;

	            var queryParams = parseQueryParams(path);

	            Object.keys(queryParams).filter(function (p) {
	                return _this3.queryParams.indexOf(p) >= 0;
	            }).forEach(function (p) {
	                return appendQueryParam(match, p, queryParams[p]);
	            });

	            return match;
	        }
	    }, {
	        key: 'build',
	        value: function build() {
	            var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	            var opts = arguments.length <= 1 || arguments[1] === undefined ? { ignoreConstraints: false, ignoreSearch: false } : arguments[1];

	            // Check all params are provided (not search parameters which are optional)
	            if (this.urlParams.some(function (p) {
	                return params[p] === undefined;
	            })) throw new Error('Missing parameters');

	            // Check constraints
	            if (!opts.ignoreConstraints) {
	                var constraintsPassed = this.tokens.filter(function (t) {
	                    return (/^url-parameter/.test(t.type) && !/-splat$/.test(t.type)
	                    );
	                }).every(function (t) {
	                    return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(params[t.val]);
	                });

	                if (!constraintsPassed) throw new Error('Some parameters are of invalid format');
	            }

	            var base = this.tokens.filter(function (t) {
	                return t.type !== 'query-parameter';
	            }).map(function (t) {
	                if (t.type === 'url-parameter-matrix') return ';' + t.val[0] + '=' + params[t.val[0]];
	                return (/^url-parameter/.test(t.type) ? params[t.val[0]] : t.match
	                );
	            }).join('');

	            if (opts.ignoreSearch) return base;

	            var searchPart = this.queryParams.filter(function (p) {
	                return Object.keys(params).indexOf(p) !== -1;
	            }).map(function (p) {
	                return _serialise(p, params[p]);
	            }).join('&');

	            return base + (searchPart ? '?' + searchPart : '');
	        }
	    }]);

	    return Path;
	})();

	exports['default'] = Path;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function nameToIDs(name) {
	    return name.split('.').reduce(function (ids, name) {
	        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
	    }, []);
	}

	function extractSegmentParams(name, state) {
	    if (!state._meta || !state._meta[name]) return {};

	    return Object.keys(state._meta[name]).reduce(function (params, p) {
	        params[p] = state.params[p];
	        return params;
	    }, {});
	}

	function transitionPath(toState, fromState) {
	    var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
	    var toStateIds = nameToIDs(toState.name);
	    var maxI = Math.min(fromStateIds.length, toStateIds.length);

	    function pointOfDifference() {
	        var i = undefined;

	        var _loop = function () {
	            var left = fromStateIds[i];
	            var right = toStateIds[i];

	            if (left !== right) return {
	                    v: i
	                };

	            var leftParams = extractSegmentParams(left, toState);
	            var rightParams = extractSegmentParams(right, fromState);

	            if (leftParams.length !== rightParams.length) return {
	                    v: i
	                };
	            if (leftParams.length === 0) return 'continue';

	            var different = Object.keys(leftParams).some(function (p) {
	                return rightParams[p] !== leftParams[p];
	            });
	            if (different) {
	                return {
	                    v: i
	                };
	            }
	        };

	        for (i = 0; i < maxI; i += 1) {
	            var _ret = _loop();

	            switch (_ret) {
	                case 'continue':
	                    continue;

	                default:
	                    if (typeof _ret === 'object') return _ret.v;
	            }
	        }

	        return i;
	    }

	    var i = undefined;
	    if (!fromState) {
	        i = 0;
	    } else if (!fromState || toState.name === fromState.name && (!toState._meta || !fromState._meta)) {
	        console.log('[router5.transition-path] Some states are missing metadata, reloading all segments');
	        i = 0;
	    } else {
	        i = pointOfDifference();
	    }

	    var toDeactivate = fromStateIds.slice(i).reverse();
	    var toActivate = toStateIds.slice(i);

	    var intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';

	    return {
	        intersection: intersection,
	        toDeactivate: toDeactivate,
	        toActivate: toActivate
	    };
	}

	exports['default'] = transitionPath;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;

	var _router = __webpack_require__(4);

	var _router2 = _interopRequireDefault(_router);

	var _async = __webpack_require__(6);

	var _async2 = _interopRequireDefault(_async);

	var _constants = __webpack_require__(7);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	exports.default = transition;

	var nameToIDs = function nameToIDs(name) {
	    return name.split('.').reduce(function (ids, name) {
	        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
	    }, []);
	};

	function transition(router, toState, fromState, callback) {
	    var cancelled = false;
	    var additionalArgs = router.getAdditionalArgs();
	    var isCancelled = function isCancelled() {
	        return cancelled;
	    };
	    var cancel = function cancel() {
	        return cancelled = true;
	    };
	    var done = function done(err, state) {
	        if (!err && !isCancelled() && router.options.autoCleanUp) {
	            (function () {
	                var activeSegments = nameToIDs(toState.name);
	                Object.keys(router._cmps).filter(function (name) {
	                    if (activeSegments.indexOf(name) === -1) router.deregisterComponent(name);
	                });
	            })();
	        }
	        callback(isCancelled() ? { code: _constants2.default.TRANSITION_CANCELLED } : err, state || toState);
	    };

	    var _transitionPath = (0, _router2.default)(toState, fromState);

	    var toDeactivate = _transitionPath.toDeactivate;
	    var toActivate = _transitionPath.toActivate;

	    var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState, additionalArgs: [] };

	    var canDeactivate = function canDeactivate(toState, fromState, cb) {
	        var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
	            return router._cmps[name] && router._cmps[name].canDeactivate;
	        }).reduce(function (fnMap, name) {
	            var _extends2;

	            return _extends({}, fnMap, (_extends2 = {}, _extends2[name] = router._cmps[name].canDeactivate, _extends2));
	        }, {});

	        (0, _async2.default)(canDeactivateFunctionMap, _extends({}, asyncBase, { additionalArgs: additionalArgs }), function (err) {
	            return cb(err ? { code: _constants2.default.CANNOT_DEACTIVATE, segment: err } : null);
	        });
	    };

	    var canActivate = function canActivate(toState, fromState, cb) {
	        var canActivateFunctionMap = toActivate.filter(function (name) {
	            return router._canAct[name];
	        }).reduce(function (fnMap, name) {
	            var _extends3;

	            return _extends({}, fnMap, (_extends3 = {}, _extends3[name] = router._canAct[name], _extends3));
	        }, {});

	        (0, _async2.default)(canActivateFunctionMap, _extends({}, asyncBase, { additionalArgs: additionalArgs }), function (err) {
	            return cb(err ? { code: _constants2.default.CANNOT_ACTIVATE, segment: err } : null);
	        });
	    };

	    var middlewareFn = router.mware;
	    var middleware = function middleware(toState, fromState, cb) {
	        var mwareFunction = Array.isArray(router.mware) ? router.mware : [router.mware];

	        (0, _async2.default)(mwareFunction, _extends({}, asyncBase, { context: { cancel: cancel, router: router } }), function (err, state) {
	            var errObj = err ? (typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? err : { error: err } : null;
	            cb(err ? _extends({ code: _constants2.default.TRANSITION_ERR }, errObj) : null, state || toState);
	        });
	    };

	    var pipeline = (fromState ? [canDeactivate] : []).concat(canActivate).concat(middlewareFn ? middleware : []);

	    (0, _async2.default)(pipeline, asyncBase, done);

	    return cancel;
	}
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;
	exports.default = asyncProcess;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function asyncProcess(functions, _ref, callback) {
	    var isCancelled = _ref.isCancelled;
	    var toState = _ref.toState;
	    var fromState = _ref.fromState;
	    var context = _ref.context;
	    var additionalArgs = _ref.additionalArgs;
	    var allowBool = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	    var remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

	    var initialFromState = _extends({}, fromState);
	    var isState = function isState(obj) {
	        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.name !== undefined && obj.params !== undefined && obj.path !== undefined;
	    };
	    var hasStateChanged = function hasStateChanged(state) {
	        return state.name !== toState.name || state.params !== toState.params || state.path !== toState.path;
	    };

	    var processFn = function processFn(done) {
	        if (!remainingFunctions.length) return true;

	        var isMapped = typeof remainingFunctions[0] === 'string';
	        var errVal = isMapped ? remainingFunctions[0] : {};
	        var stepFn = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];

	        // const len = stepFn.length;
	        var res = stepFn.apply(context || null, additionalArgs.concat([toState, fromState, done]));

	        if (allowBool && typeof res === 'boolean') {
	            done(res ? null : errVal);
	        } else if (res && typeof res.then === 'function') {
	            res.then(function (resVal) {
	                return done(null, resVal);
	            }, function () {
	                return done(errVal);
	            });
	        }
	        // else: wait for done to be called

	        return false;
	    };

	    var iterate = function iterate(err, val) {
	        if (err) callback(err);else {
	            if (val && isState(val)) {
	                if (hasStateChanged(val)) console.error('[router5][transition] State values changed during transition process and ignored.');else toState = val;
	            }
	            remainingFunctions = remainingFunctions.slice(1);
	            next();
	        }
	    };

	    var next = function next() {
	        if (isCancelled()) {
	            callback(null);
	        } else {
	            var finished = processFn(iterate);
	            if (finished) callback(null, toState);
	        }
	    };

	    next();
	}
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var constants = {
	    ROUTER_NOT_STARTED: 'NOT_STARTED',
	    ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
	    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
	    SAME_STATES: 'SAME_STATES',
	    CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
	    CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
	    TRANSITION_ERR: 'TRANSITION_ERR',
	    TRANSITION_CANCELLED: 'CANCELLED'
	};

	exports.default = constants;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	function loggerPlugin() {
	    var startGroup = function startGroup() {
	        return console.group('Router transition');
	    };
	    var endGroup = function endGroup() {
	        return console.groupEnd('Router transition');
	    };

	    return {
	        name: 'LOGGER',
	        onStart: function onStart() {
	            console.info('Router started');
	        },
	        onStop: function onStop() {
	            console.info('Router stopped');
	        },
	        onTransitionStart: function onTransitionStart(toState, fromState) {
	            endGroup();
	            startGroup();
	            console.log('Transition started from state');
	            console.log(fromState);
	            console.log('To state');
	            console.log(toState);
	        },
	        onTransitionCancel: function onTransitionCancel(toState, fromState) {
	            console.warn('Transition cancelled');
	        },
	        onTransitionError: function onTransitionError(toState, fromState, err) {
	            console.warn('Transition error with code ' + err.code);
	            endGroup();
	        },
	        onTransitionSuccess: function onTransitionSuccess(toState, fromState) {
	            console.log('Transition success');
	            endGroup();
	        }
	    };
	}

	exports.default = loggerPlugin;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;