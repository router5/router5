/**
 * @license
 * @version 0.5.5
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
    
    var parseQueryParams = function parseQueryParams(path) {
        var searchPart = path.split('?')[1];
        if (!searchPart) return {};
        return searchPart.split('&').map(function (_) {
            return _.split('=');
        }).reduce(function (obj, m) {
            obj[m[0]] = m[1] === undefined ? '' : m[1];
            return obj;
        }, {});
    };
    
    var isSerialisable = function isSerialisable(val) {
        return val !== undefined && val !== null && val !== '';
    };
    
    var Path = (function () {
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
                    return match[p] = queryParams[p];
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
                    return p + (isSerialisable(params[p]) ? '=' + params[p] : '');
                }).join('&');
    
                return base + (searchPart ? '?' + searchPart : '');
            }
        }]);
    
        return Path;
    })();
    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
    
    var isSerialisable = function isSerialisable(val) {
        return val !== undefined && val !== null && val !== '';
    };
    
    var removeQueryParamsFromPath = function removeQueryParamsFromPath(path, params) {
        if (path.indexOf('?') === -1) return path;
    
        var _path$split = path.split('?');
    
        var _path$split2 = _slicedToArray(_path$split, 2);
    
        var pathPart = _path$split2[0];
        var searchPart = _path$split2[1];
    
        var remainingSearchParams = searchPart.split('&').reduce(function (obj, p) {
            var _p$split = p.split('=');
    
            var _p$split2 = _slicedToArray(_p$split, 2);
    
            var key = _p$split2[0];
            var val = _p$split2[1];
    
            if (params.indexOf(key) === -1) obj[key] = val || '';
            return obj;
        }, {});
    
        var remainingSearchPart = Object.keys(remainingSearchParams).map(function (p) {
            return [p].concat(isSerialisable(remainingSearchParams[p]) ? remainingSearchParams[p] : []);
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
            this.parser = path ? new Path(path) : null;
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
            value: function getSegmentsMatchingPath(path) {
                var trailingSlash = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    
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
                var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    
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
                    return p + '=' + params[p];
                }).join('&');
    
                return segments ? segments.map(function (segment) {
                    return segment.parser.build(params, { ignoreSearch: true });
                }).join('') + (searchPart ? '?' + searchPart : '') : null;
            }
        }, {
            key: 'buildPath',
            value: function buildPath(routeName) {
                var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    
                return this.buildPathFromSegments(this.getSegmentsByName(routeName), params);
            }
        }, {
            key: 'getMatchPathFromSegments',
            value: function getMatchPathFromSegments(segments) {
                if (!segments || !segments.length) return null;
    
                var name = segments.map(function (segment) {
                    return segment.name;
                }).join('.');
                var params = segments.params;
    
                return { name: name, params: params };
            }
        }, {
            key: 'matchPath',
            value: function matchPath(path) {
                var trailingSlash = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    
                return this.getMatchPathFromSegments(this.getSegmentsMatchingPath(path, trailingSlash));
            }
        }]);
    
        return RouteNode;
    })();
    var constants = {
        ROUTER_NOT_STARTED: 'NOT_STARTED',
        ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
        ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
        SAME_STATES: 'SAME_STATES',
        CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
        CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
        TRANSITION_ERR: 'TRANSITION_ERR',
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
    function asyncProcess(isCancelled, functions, toState, fromState, callback) {
        var allowNoResult = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
    
        isCancelled = isCancelled || function () {
            return false;
        };
        var remainingSteps = functions || [];
    
        var processFn = function processFn(done) {
            if (!remainingSteps.length) return true;
    
            var len = remainingSteps[0].length;
            var res = remainingSteps[0](toState, fromState, done);
    
            if (typeof res === 'boolean') {
                done(res ? null : true);
            } else if (res && typeof res.then === 'function') {
                res.then(function () {
                    return done(null);
                }, function () {
                    return done(true);
                });
            } else if (len < 3 && allowNoResult) {
                done(null);
            }
    
            return false;
        };
    
        var iterate = function iterate(err) {
            if (err) callback(err);else {
                remainingSteps = remainingSteps.slice(1);
                next();
            }
        };
    
        var next = function next() {
            if (isCancelled()) {
                callback(null);
            } else {
                var finished = processFn(iterate);
                if (finished) callback(null);
            }
        };
    
        next();
    }
    function transitionPath(toState, fromState) {
        var nameToIDs = function nameToIDs(name) {
            return name.split('.').reduce(function (ids, name) {
                return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
            }, []);
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
    
        return { intersection: intersection, toDeactivate: toDeactivate, toActivate: toActivate };
    }
    
    function transition(router, toState, fromState, callback) {
        var cancelled = false;
        var isCancelled = function isCancelled() {
            return cancelled;
        };
        var cancel = function cancel() {
            return cancelled = true;
        };
        var done = function done(err) {
            return callback(cancelled ? constants.TRANSITION_CANCELLED : err);
        };
    
        var _transitionPath = transitionPath(toState, fromState);
    
        var intersection = _transitionPath.intersection;
        var toDeactivate = _transitionPath.toDeactivate;
        var toActivate = _transitionPath.toActivate;
    
        var canDeactivate = function canDeactivate(toState, fromState, cb) {
            var canDeactivateFunctions = toDeactivate.map(function (name) {
                return router._cmps[name];
            }).filter(function (comp) {
                return comp && comp.canDeactivate;
            }).map(function (comp) {
                return comp.canDeactivate;
            });
    
            asyncProcess(isCancelled, canDeactivateFunctions, toState, fromState, function (err) {
                return cb(err ? constants.CANNOT_DEACTIVATE : null);
            });
        };
    
        var canActivate = function canActivate(toState, fromState, cb) {
            var canActivateFunctions = toActivate.map(function (name) {
                return router._canAct[name];
            }).filter(function (_) {
                return _;
            });
    
            asyncProcess(isCancelled, canActivateFunctions, toState, fromState, function (err) {
                return cb(err ? constants.CANNOT_ACTIVATE : null);
            });
        };
    
        var middlewareFn = router._onTr;
        var middleware = function middleware(toState, fromState, cb) {
            var mwareFunction = [middlewareFn];
    
            asyncProcess(isCancelled, mwareFunction, toState, fromState, function (err) {
                return cb(err ? constants.TRANSITION_ERR : null);
            });
        };
    
        var nodeListenerFn = router._cbs['^' + intersection];
        var nodeListener = function nodeListener(toState, fromState, cb) {
            var listeners = nodeListenerFn;
    
            asyncProcess(isCancelled, listeners, toState, fromState, function (err) {
                return cb(err ? constants.NODE_LISTENER_ERR : null);
            }, true);
        };
    
        var pipeline = (fromState ? [canDeactivate] : []).concat(canActivate).concat(middlewareFn ? middleware : []).concat(nodeListenerFn && nodeListenerFn.length ? nodeListener : []);
    
        asyncProcess(isCancelled, pipeline, toState, fromState, done);
    
        return cancel;
    }
    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
    
    var _slice = Array.prototype.slice;
    
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
        _createClass(Router5, null, [{
            key: 'ERR',
    
            /**
             * Error codes
             * @type {Object}
             */
            value: constants,
    
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
            value: transitionPath,
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
            this.rootNode = routes instanceof RouteNode ? routes : new RouteNode('', '', routes);
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
                if (this.options.useHash && !this.options.base) this.options.base = browser.getBase();
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
                        browser.pushState(_this2.lastKnownState, '', url);
                    } else {
                        browser[newState ? 'pushState' : 'replaceState'](state, '', _this2.buildUrl(state.name, state.params));
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
                    if (done) done(constants.ROUTER_ALREADY_STARTED);
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
    
                    browser.addPopstateListener(_this3.boundOnPopState);
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
                                    browser.replaceState(_this3.lastKnownState, '', _this3.buildUrl(startState.name, startState.params));
                                    cb(null, state);
                                } else if (opts.defaultRoute) navigateToDefault();else cb(err, null, false);
                            });
                        } else if (opts.defaultRoute) {
                            // If default, navigate to default
                            navigateToDefault();
                        } else {
                            // No start match, no default => do nothing
                            cb(constants.ROUTE_NOT_FOUND, null);
                        }
                    })();
                } else {
                    // Initialise router with provided start state
                    this.lastKnownState = startState;
                    browser.replaceState(this.lastKnownState, '', this.buildUrl(startState.name, startState.params));
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
    
                browser.removePopstateListener(this.boundOnPopState);
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
                return browser.getLocation(this.options);
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
    
                var tr = transition(this, toState, fromState, function (err) {
                    _this4._tr = null;
    
                    if (err) {
                        if (err === constants.TRANSITION_CANCELLED) _this4._invokeListeners('$cancel', toState, fromState);else _this4._invokeListeners('$error', toState, fromState, err);
    
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
                    if (done) done(constants.ROUTER_NOT_STARTED);
                    return;
                }
    
                var path = this.buildPath(name, params);
                var url = this.buildUrl(name, params);
    
                if (!path) {
                    if (done) done(constants.ROUTE_NOT_FOUND);
                    this._invokeListeners('$error', null, this.lastKnownState, constants.ROUTE_NOT_FOUND);
                    return;
                }
    
                var toState = makeState(name, params, path);
                this.lastStateAttempt = toState;
                var sameStates = this.lastKnownState ? this.areStatesEqual(this.lastKnownState, this.lastStateAttempt) : false;
    
                // Do not proceed further if states are the same and no reload
                // (no desactivation and no callbacks)
                if (sameStates && !opts.reload) {
                    if (done) done(constants.SAME_STATES);
                    this._invokeListeners('$error', toState, this.lastKnownState, constants.SAME_STATES);
                    return;
                }
    
                // Transition and amend history
                return this._transition(toState, sameStates ? null : this.lastKnownState, function (err, state) {
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

    window.RouteNode = RouteNode;
    window.Router5 = Router5;

}(window));
