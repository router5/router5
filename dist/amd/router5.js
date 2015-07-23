/**
 * @license
 * @version 0.2.1
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
define('router5', [], function () {
    
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
    }, {
        // Delimiter /
        name: 'delimiter',
        pattern: /^(\/|\?)/,
        regex: function regex(match) {
            return new RegExp(match[0]);
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
        var tokens = arguments[1] === undefined ? [] : arguments[1];
    
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
    
    var Path = (function () {
        function Path(path) {
            _classCallCheck(this, Path);
    
            if (!path) throw new Error('Please supply a path');
            this.path = path;
            this.tokens = tokenise(path);
    
            this.hasUrlParams = this.tokens.filter(function (t) {
                return /^url-parameter/.test(t.type);
            }).length > 0;
            this.hasSpatParam = this.tokens.filter(function (t) {
                return /splat$/.test(t.type);
            }).length > 0;
            this.hasMatrixParams = this.tokens.filter(function (t) {
                return /matrix$/.test(t.type);
            }).length > 0;
            this.hasQueryParams = this.tokens.filter(function (t) {
                return t.type === 'query-parameter';
            }).length > 0;
            // Extract named parameters from tokens
            this.urlParams = !this.hasUrlParams ? [] : this.tokens.filter(function (t) {
                return /^url-parameter/.test(t.type);
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
    
                // Check if exact match
                var match = this._urlMatch(path, new RegExp('^' + this.source + (this.hasQueryParams ? '?.*$' : '$')));
                // If no match, or no query params, no need to go further
                if (!match || !this.hasQueryParams) return match;
                // Extract query params
                var queryParams = path.split('?')[1].split('&').map(function (_) {
                    return _.split('=');
                }).reduce(function (obj, m) {
                    obj[m[0]] = m[1];
                    return obj;
                }, {});
    
                if (Object.keys(queryParams).every(function (p) {
                    return Object.keys(_this2.queryParams).indexOf(p) !== 1;
                }) && Object.keys(queryParams).length === this.queryParams.length) {
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
                // Check if partial match (start of given path matches regex)
                return this._urlMatch(path, new RegExp('^' + this.source));
            }
        }, {
            key: 'build',
            value: function build() {
                var params = arguments[0] === undefined ? {} : arguments[0];
                var ignoreConstraints = arguments[1] === undefined ? false : arguments[1];
    
                // Check all params are provided (not search parameters which are optional)
                if (!this.params.every(function (p) {
                    return params[p] !== undefined;
                })) throw new Error('Missing parameters');
    
                // Check constraints
                if (!ignoreConstraints) {
                    var constraintsPassed = this.tokens.filter(function (t) {
                        return /^url-parameter/.test(t.type) && !/-splat$/.test(t.type);
                    }).every(function (t) {
                        return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(params[t.val]);
                    });
    
                    if (!constraintsPassed) throw new Error('Some parameters are of invalid format');
                }
    
                var base = this.tokens.filter(function (t) {
                    return t.type !== 'query-parameter';
                }).map(function (t) {
                    if (t.type === 'url-parameter-matrix') return ';' + t.val[0] + '=' + params[t.val[0]];
                    return /^url-parameter/.test(t.type) ? params[t.val[0]] : t.match;
                }).join('');
    
                var searchPart = this.queryParams.map(function (p) {
                    return p + '=' + params[p];
                }).join('&');
    
                return base + (searchPart ? '?' + searchPart : '');
            }
        }]);
    
        return Path;
    })();
    
    // regex:   match => new RegExp('(?=(\?|.*&)' + match[0] + '(?=(\=|&|$)))')
    var constants = {
        ROUTER_NOT_STARTED: 1,
        SAME_STATES: 2,
        CANNOT_DEACTIVATE: 3,
        CANNOT_ACTIVATE: 4,
        NODE_LISTENER_ERR: 5,
        TRANSITION_CANCELLED: 6
    };
    var RouteNode = (function () {
        function RouteNode() {
            var name = arguments[0] === undefined ? '' : arguments[0];
            var path = arguments[1] === undefined ? '' : arguments[1];
            var childRoutes = arguments[2] === undefined ? [] : arguments[2];
    
            _classCallCheck(this, RouteNode);
    
            this.name = name;
            this.path = path;
            this.parser = path ? new Path(path) : null;
            this.children = [];
    
            this.add(childRoutes);
    
            return this;
        }
    
        _createClass(RouteNode, [{
            key: 'add',
            value: function add(route) {
                var _this = this;
    
                if (route instanceof Array) {
                    route.forEach(function (r) {
                        return _this.add(r);
                    });
                    return;
                }
    
                if (!(route instanceof RouteNode) && !(route instanceof Object)) {
                    throw new Error('Route constructor expects routes to be an Object or an instance of Route.');
                }
                if (route instanceof Object) {
                    if (!route.name || !route.path) {
                        throw new Error('Route constructor expects routes to have an name and a path defined.');
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
                        if (!a.parser.hasSpatParam && b.parser.hasSpatParam) return -1;
                        if (!b.parser.hasSpatParam && a.parser.hasSpatParam) return 1;
                        if (!a.parser.hasUrlParams && b.parser.hasUrlParams) return -1;
                        if (!b.parser.hasUrlParams && a.parser.hasUrlParams) return 1;
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
            value: function getSegmentsMatchingPath(path) {
                var matchChildren = function matchChildren(nodes, pathSegment, segments) {
                    var _loop = function (i) {
                        var child = nodes[i];
                        // Partially match path
                        var match = child.parser.partialMatch(pathSegment);
                        if (match) {
                            segments.push(child);
                            Object.keys(match).forEach(function (param) {
                                return segments.params[param] = match[param];
                            });
                            // Remove consumed segment from path
                            var remainingPath = pathSegment.replace(child.parser.build(match), '');
                            // If fully matched
                            if (!remainingPath.length) {
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
                var params = arguments[1] === undefined ? {} : arguments[1];
    
                return segments ? segments.map(function (segment) {
                    return segment.parser.build(params);
                }).join('') : null;
            }
        }, {
            key: 'buildPath',
            value: function buildPath(routeName) {
                var params = arguments[1] === undefined ? {} : arguments[1];
    
                return this.buildPathFromSegments(this.getSegmentsByName(routeName), params);
            }
        }, {
            key: 'getMatchPathFromSegments',
            value: function getMatchPathFromSegments(segments) {
                if (!segments) return null;
    
                var name = segments.map(function (segment) {
                    return segment.name;
                }).join('.');
                var params = segments.params;
    
                return { name: name, params: params };
            }
        }, {
            key: 'matchPath',
            value: function matchPath(path) {
                return this.getMatchPathFromSegments(this.getSegmentsMatchingPath(path));
            }
        }]);
    
        return RouteNode;
    })();
    function asyncProcess(functions, toState, fromState, callback) {
        var allowNoResult = arguments[4] === undefined ? false : arguments[4];
    
        var remainingSteps = functions || [];
    
        var processFn = function processFn(done) {
            if (!remainingSteps.length) return true;
    
            var len = remainingSteps[0].length;
            var res = remainingSteps[0](toState, fromState, done);
    
            if (typeof res === 'boolean') done(!res, res);else if (res && typeof res.then === 'function') {
                res.then(function () {
                    return done(null, true);
                }, function () {
                    return done(true, null);
                });
            } else if (len < 3 && allowNoResult) done(null, true);
    
            return false;
        };
    
        var iterate = function iterate(err, res) {
            if (err) callback(err);else {
                remainingSteps = remainingSteps.slice(1);
                next();
            }
        };
    
        var next = function next() {
            var finished = processFn(iterate);
            if (finished) callback(null, true);
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
        var done = function done(err, res) {
            return callback(cancelled ? constants.TRANSITION_CANCELLED : err, res);
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
    
                asyncProcess(canDeactivateFunctions, toState, fromState, function (err, res) {
                    return cb(err ? constants.CANNOT_DEACTIVATE : null, res);
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
    
                asyncProcess(canActivateFunctions, toState, fromState, function (err, res) {
                    return cb(err ? constants.CANNOT_ACTIVATE : null, res);
                });
            }
        };
    
        var nodeListener = function nodeListener(toState, fromState, cb) {
            if (cancelled) done();else {
                var listeners = router._cbs['^' + intersection] || [];
                asyncProcess(listeners, toState, fromState, function (err, res) {
                    return cb(err ? constants.NODE_LISTENER_ERR : null, res);
                }, true);
            }
        };
    
        var pipeline = fromState ? [canDeactivate, canActivate, nodeListener] : [canActivate];
        asyncProcess(pipeline, toState, fromState, done);
    
        return cancel;
    }
    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
    
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
    
                var tr = transition(this, toState, fromState, function (err) {
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
                    done(constants.ROUTER_NOT_STARTED);
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
                    if (done) done(constants.SAME_STATES);
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

    return {RouteNode: RouteNode, Router5: Router5};
});
