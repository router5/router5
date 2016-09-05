(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('router5', ['exports'], factory) :
    (factory((global.router5 = global.router5 || {})));
}(this, function (exports) { 'use strict';

    var babelHelpers = {};
    babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    babelHelpers.classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    babelHelpers.createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    babelHelpers.defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    babelHelpers.extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    babelHelpers.slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    babelHelpers.toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    babelHelpers;

    var defaultOrConstrained = function defaultOrConstrained(match) {
        return '(' + (match ? match.replace(/(^<|>$)/g, '') : '[a-zA-Z0-9-_.~%]+') + ')';
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
        name: 'query-parameter-bracket',
        pattern: /^(?:\?|&)(?:\:)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(?:\[\])/
    }, // regex:   match => new RegExp('(?=(\?|.*&)' + match[0] + '(?=(\=|&|$)))')
    {
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
        pattern: /^([0-9a-zA-Z]+)/,
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

    var withoutBrackets = function withoutBrackets(param) {
        return param.replace(/\[\]$/, '');
    };

    var appendQueryParam = function appendQueryParam(params, param) {
        var val = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

        if (/\[\]$/.test(param)) {
            param = withoutBrackets(param);
            val = [val];
        }
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
        return val !== undefined && val !== null && val !== '' ? '=' + val : '';
    };

    var _serialise = function _serialise(key, val) {
        return Array.isArray(val) ? val.map(function (v) {
            return _serialise(key, v);
        }).join('&') : key + toSerialisable(val);
    };

    var Path = function () {
        babelHelpers.createClass(Path, null, [{
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
            babelHelpers.classCallCheck(this, Path);

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
                return (/^query-parameter/.test(t.type)
                );
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
            }).reduce(function (r, v) {
                return r.concat(v);
            }, []);

            this.queryParamsBr = !this.hasQueryParams ? [] : this.tokens.filter(function (t) {
                return (/-bracket$/.test(t.type)
                );
            }).map(function (t) {
                return t.val;
            }).reduce(function (r, v) {
                return r.concat(v);
            }, []);

            this.params = this.urlParams.concat(this.queryParams).concat(this.queryParamsBr);
            // Check if hasQueryParams
            // Regular expressions for url part only (full and partial match)
            this.source = this.tokens.filter(function (t) {
                return t.regex !== undefined;
            }).map(function (r) {
                return r.regex.source;
            }).join('');
        }

        babelHelpers.createClass(Path, [{
            key: '_urlMatch',
            value: function _urlMatch(path, regex) {
                var _this = this;

                var match = path.match(regex);
                if (!match) return null;else if (!this.urlParams.length) return {};
                // Reduce named params to key-value pairs
                return match.slice(1, this.urlParams.length + 1).reduce(function (params, m, i) {
                    params[_this.urlParams[i]] = decodeURIComponent(m);
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
                var matched = this._urlMatch(path, new RegExp('^' + source + (this.hasQueryParams ? '(\\?.*$|$)' : '$')));
                // If no match, or no query params, no need to go further
                if (!matched || !this.hasQueryParams) return matched;
                // Extract query params
                var queryParams = parseQueryParams(path);
                var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) {
                    return _this2.queryParams.concat(_this2.queryParamsBr).indexOf(p) === -1;
                });

                if (unexpectedQueryParams.length === 0) {
                    // Extend url match
                    Object.keys(queryParams).forEach(function (p) {
                        return matched[p] = queryParams[p];
                    });

                    return matched;
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
                    return _this3.queryParams.concat(_this3.queryParamsBr).indexOf(p) >= 0;
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

                var encodedParams = Object.keys(params).reduce(function (acc, key) {
                    // Use encodeURI in case of spats
                    if (params[key] === undefined) {
                        acc[key] = undefined;
                    } else {
                        acc[key] = Array.isArray(params[key]) ? params[key].map(encodeURI) : encodeURI(params[key]);
                    }
                    return acc;
                }, {});
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
                        return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedParams[t.val]);
                    });

                    if (!constraintsPassed) throw new Error('Some parameters are of invalid format');
                }

                var base = this.tokens.filter(function (t) {
                    return (/^query-parameter/.test(t.type) === false
                    );
                }).map(function (t) {
                    if (t.type === 'url-parameter-matrix') return ';' + t.val + '=' + encodedParams[t.val[0]];
                    return (/^url-parameter/.test(t.type) ? encodedParams[t.val[0]] : t.match
                    );
                }).join('');

                if (opts.ignoreSearch) return base;

                var queryParams = this.queryParams.concat(this.queryParamsBr.map(function (p) {
                    return p + '[]';
                }));

                var searchPart = queryParams.filter(function (p) {
                    return Object.keys(encodedParams).indexOf(withoutBrackets(p)) !== -1;
                }).map(function (p) {
                    return _serialise(p, encodedParams[withoutBrackets(p)]);
                }).join('&');

                return base + (searchPart ? '?' + searchPart : '');
            }
        }]);
        return Path;
    }();

    // Split path
    var getPath = function getPath(path) {
        return path.split('?')[0];
    };
    var getSearch = function getSearch(path) {
        return path.split('?')[1];
    };

    // Search param value
    var isSerialisable = function isSerialisable(val) {
        return val !== undefined && val !== null && val !== '';
    };

    // Search param name
    var bracketTest = /\[\]$/;
    var withoutBrackets$1 = function withoutBrackets(paramName) {
        return paramName.replace(bracketTest, '');
    };

    /**
     * Parse a querystring and return a list of params (Objects with name and value properties)
     * @param  {String} querystring The querystring to parse
     * @return {Array[Object]}      The list of params
     */
    var parse = function parse(querystring) {
        return querystring.split('&').reduce(function (params, param) {
            var split = param.split('=');
            var name = split[0];
            var value = split[1];
            return params.concat({ name: name, value: decodeURIComponent(value) });
        }, []);
    };

    /**
     * Build a querystring from a list of parameters
     * @param  {Array} paramList The list of parameters (see `.parse()`)
     * @return {String}          The querystring
     */
    var build = function build(paramList) {
        return paramList.map(function (_ref2) {
            var name = _ref2.name;
            var value = _ref2.value;
            return [name].concat(isSerialisable(value) ? encodeURIComponent(value) : []);
        }).map(function (param) {
            return param.join('=');
        }).join('&');
    };

    /**
     * Remove a list of parameters from a querystring
     * @param  {String} querystring  The original querystring
     * @param  {Array}  paramsToOmit The parameters to omit
     * @return {String}              The querystring
     */
    var omit = function omit(querystring, paramsToOmit) {
        if (!querystring) return '';

        var remainingQueryParams = parse(querystring).filter(function (_ref3) {
            var name = _ref3.name;
            return paramsToOmit.indexOf(withoutBrackets$1(name)) === -1;
        });
        var remainingQueryString = build(remainingQueryParams);

        return remainingQueryString || '';
    };

    var noop = function noop() {};

    var RouteNode = function () {
        function RouteNode() {
            var name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            var path = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
            var childRoutes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
            var cb = arguments[3];
            babelHelpers.classCallCheck(this, RouteNode);

            this.name = name;
            this.path = path;
            this.parser = path ? new Path(path) : null;
            this.children = [];

            this.add(childRoutes, cb);

            return this;
        }

        babelHelpers.createClass(RouteNode, [{
            key: 'setPath',
            value: function setPath() {
                var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

                this.path = path;
                this.parser = path ? new Path(path) : null;
            }
        }, {
            key: 'add',
            value: function add(route) {
                var _this = this;

                var cb = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

                var originalRoute = void 0;
                if (route === undefined || route === null) return;

                if (route instanceof Array) {
                    route.forEach(function (r) {
                        return _this.add(r, cb);
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
                    originalRoute = route;
                    route = new RouteNode(route.name, route.path, route.children, cb);
                }

                var names = route.name.split('.');

                if (names.length === 1) {
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

                    this.children.push(route);
                    // Push greedy spats to the bottom of the pile
                    this.children.sort(function (left, right) {
                        var leftPath = left.path.split('?')[0].replace(/(.+)\/$/, '$1');
                        var rightPath = right.path.split('?')[0].replace(/(.+)\/$/, '$1');
                        // '/' last
                        if (leftPath === '/') return 1;
                        if (rightPath === '/') return -1;
                        // Spat params last
                        if (left.parser.hasSpatParam) return 1;
                        if (right.parser.hasSpatParam) return -1;
                        // No spat, number of segments (less segments last)
                        var leftSegments = (leftPath.match(/\//g) || []).length;
                        var rightSegments = (rightPath.match(/\//g) || []).length;
                        if (leftSegments < rightSegments) return 1;
                        if (leftSegments > rightSegments) return -1;
                        // Same number of segments, number of URL params ascending
                        var leftParamsCount = left.parser.urlParams.length;
                        var rightParamsCount = right.parser.urlParams.length;
                        if (leftParamsCount < rightParamsCount) return -1;
                        if (leftParamsCount > rightParamsCount) return 1;
                        // Same number of segments and params, last segment length descending
                        var leftParamLength = (leftPath.split('/').slice(-1)[0] || '').length;
                        var rightParamLength = (rightPath.split('/').slice(-1)[0] || '').length;
                        if (leftParamLength < rightParamLength) return 1;
                        if (leftParamLength > rightParamLength) return -1;
                        // Same last segment length, preserve definition order
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

                if (originalRoute) cb(originalRoute);

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
                var routes = this.parser ? [this] : this.children;
                var names = (this.parser ? [''] : []).concat(routeName.split('.'));

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
                    var isRoot = nodes.length === 1 && nodes[0].name === '';
                    // for (child of node.children) {
                    var _loop = function _loop(i) {
                        var child = nodes[i];
                        // Partially match path
                        var match = child.parser.partialMatch(pathSegment);
                        var remainingPath = void 0;

                        if (!match && trailingSlash) {
                            // Try with optional trailing slash
                            match = child.parser.match(pathSegment, true);
                            remainingPath = '';
                        } else if (match) {
                            // Remove consumed segment from path
                            var consumedPath = child.parser.build(match, { ignoreSearch: true });
                            remainingPath = pathSegment.replace(consumedPath, '');
                            var search = omit(getSearch(pathSegment.replace(consumedPath, '')), child.parser.queryParams.concat(child.parser.queryParamsBr));
                            remainingPath = getPath(remainingPath) + (search ? '?' + search : '');

                            if (trailingSlash && !isRoot && remainingPath === '/' && !/\/$/.test(consumedPath)) {
                                remainingPath = '';
                            }
                        }

                        if (match) {
                            segments.push(child);
                            Object.keys(match).forEach(function (param) {
                                return segments.params[param] = match[param];
                            });

                            if (!isRoot && !remainingPath.length) {
                                // fully matched
                                return {
                                    v: segments
                                };
                            }
                            if (!isRoot && !strictQueryParams && remainingPath.indexOf('?') === 0) {
                                // unmatched queryParams in non strict mode
                                var remainingQueryParams = parse(remainingPath.slice(1));

                                remainingQueryParams.forEach(function (_ref) {
                                    var name = _ref.name;
                                    var value = _ref.value;
                                    return segments.params[name] = value;
                                });
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

                    for (var i in nodes) {
                        var _ret = _loop(i);

                        if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
                    }

                    return null;
                };

                var startingNodes = this.parser ? [this] : this.children;
                var segments = [];
                segments.params = {};

                var matched = matchChildren(startingNodes, path, segments);
                if (matched && matched.length === 1 && matched[0].name === '') return null;
                return matched;
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
                }).reduce(function (params, s) {
                    return params.concat(s.parser.queryParams).concat(s.parser.queryParamsBr.map(function (p) {
                        return p + '[]';
                    }));
                }, []);

                var searchPart = !searchParams.length ? null : searchParams.filter(function (p) {
                    return Object.keys(params).indexOf(withoutBrackets$1(p)) !== -1;
                }).map(function (p) {
                    var val = params[withoutBrackets$1(p)];
                    var encodedVal = Array.isArray(val) ? val.map(encodeURIComponent) : encodeURIComponent(val);

                    return Path.serialise(p, encodedVal);
                }).join('&');

                return segments.map(function (segment) {
                    return segment.parser.build(params, { ignoreSearch: true });
                }).join('') + (searchPart ? '?' + searchPart : '');
            }
        }, {
            key: 'getMetaFromSegments',
            value: function getMetaFromSegments(segments) {
                var accName = '';

                return segments.reduce(function (meta, segment) {
                    var urlParams = segment.parser.urlParams.reduce(function (params, p) {
                        params[p] = 'url';
                        return params;
                    }, {});

                    var allParams = segment.parser.queryParams.reduce(function (params, p) {
                        params[p] = 'query';
                        return params;
                    }, urlParams);

                    if (segment.name !== undefined) {
                        accName = accName ? accName + '.' + segment.name : segment.name;
                        meta[accName] = allParams;
                    }
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
                }).filter(function (name) {
                    return name;
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
                options = babelHelpers.extends({}, defaultOptions, options);
                return this.buildStateFromSegments(this.getSegmentsMatchingPath(path, options));
            }
        }]);
        return RouteNode;
    }();

    function withUtils(router) {
        var options = router.getOptions();

        router.isActive = isActive;
        router.areStatesEqual = areStatesEqual;
        router.areStatesDescendants = areStatesDescendants;
        router.buildPath = buildPath;
        router.buildState = buildState;
        router.matchPath = matchPath;
        router.setRootPath = setRootPath;

        function isActive(name) {
            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var strictEquality = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var ignoreQueryParams = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

            var activeState = router.getState();

            if (!activeState) return false;

            if (strictEquality || activeState.name === name) {
                return areStatesEqual(router.makeState(name, params), activeState, ignoreQueryParams);
            }

            return areStatesDescendants(router.makeState(name, params), activeState);
        }

        function areStatesEqual(state1, state2) {
            var ignoreQueryParams = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            if (state1.name !== state2.name) return false;

            var getUrlParams = function getUrlParams(name) {
                return router.rootNode.getSegmentsByName(name).map(function (segment) {
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

        function areStatesDescendants(parentState, childState) {
            var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
            if (!regex.test(childState.name)) return false;
            // If child state name extends parent state name, and all parent state params
            // are in child state params.
            return Object.keys(parentState.params).every(function (p) {
                return parentState.params[p] === childState.params[p];
            });
        }

        function buildPath(route, params) {
            return router.rootNode.buildPath(route, params);
        }

        function buildState(route, params) {
            return router.rootNode.buildState(route, params);
        }

        function matchPath(path, source) {
            var trailingSlash = options.trailingSlash;
            var strictQueryParams = options.strictQueryParams;

            var match = router.rootNode.matchPath(path, { trailingSlash: trailingSlash, strictQueryParams: strictQueryParams });
            return match ? router.makeState(match.name, match.params, path, match._meta, source) : null;
        }

        function setRootPath(rootPath) {
            router.rootNode.setPath(rootPath);
        }
    }

    var errorCodes = {
        ROUTER_NOT_STARTED: 'NOT_STARTED',
        NO_START_PATH_OR_STATE: 'NO_START_PATH_OR_STATE',
        ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
        ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
        SAME_STATES: 'SAME_STATES',
        CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
        CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
        TRANSITION_ERR: 'TRANSITION_ERR',
        TRANSITION_CANCELLED: 'CANCELLED'
    };

    var constants = {
        UNKNOWN_ROUTE: '@@router5/UNKNOWN_ROUTE',
        ROUTER_START: '$start',
        ROUTER_STOP: '$stop',
        TRANSITION_START: '$$start',
        TRANSITION_CANCEL: '$$cancel',
        TRANSITION_SUCCESS: '$$success',
        TRANSITION_ERROR: '$$error'
    };

    var noop$1 = function noop() {};

    function withRouterLifecycle(router) {
        var started = false;
        var options = router.getOptions();

        router.isStarted = isStarted;
        router.start = start;
        router.stop = stop;

        function isStarted() {
            return started;
        }

        function start() {
            var lastArg = arguments.length <= arguments.length - 1 + 0 ? undefined : arguments[arguments.length - 1 + 0];
            var done = typeof lastArg === 'function' ? lastArg : noop$1;
            var startPathOrState = typeof (arguments.length <= 0 ? undefined : arguments[0]) !== 'function' ? arguments.length <= 0 ? undefined : arguments[0] : undefined;

            if (started) {
                done({ code: errorCodes.ROUTER_ALREADY_STARTED });
                return router;
            }

            var startPath = void 0,
                startState = void 0;

            started = true;
            router.invokeEventListeners(constants.ROUTER_START);

            // callback
            var cb = function cb(err, state) {
                var invokeErrCb = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

                if (!err) router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, null, { replace: true });
                if (err && invokeErrCb) router.invokeEventListeners(constants.TRANSITION_ERROR, state, null, err);
                done(err, state);
            };

            if (startPathOrState === undefined && !options.defaultRoute) {
                return cb({ code: errorCodes.NO_START_PATH_OR_STATE });
            }if (typeof startPathOrState === 'string') {
                startPath = startPathOrState;
            } else if ((typeof startPathOrState === 'undefined' ? 'undefined' : babelHelpers.typeof(startPathOrState)) === 'object') {
                startState = startPathOrState;
            }

            if (!startState) {
                (function () {
                    // If no supplied start state, get start state
                    startState = startPath === undefined ? null : router.matchPath(startPath);
                    // Navigate to default function
                    var navigateToDefault = function navigateToDefault() {
                        return router.navigateToDefault({ replace: true }, done);
                    };
                    var redirect = function redirect(route) {
                        return router.navigate(route.name, route.params, { replace: true, reload: true }, done);
                    };
                    // If matched start path
                    if (startState) {
                        router.transitionToState(startState, router.getState(), {}, function (err, state) {
                            if (!err) cb(null, state);else if (err.redirect) redirect(err.redirect);else if (options.defaultRoute) navigateToDefault();else cb(err, null, false);
                        });
                    } else if (options.defaultRoute) {
                        // If default, navigate to default
                        navigateToDefault();
                    } else if (options.allowNotFound) {
                        cb(null, router.makeNotFoundState(startPath));
                    } else {
                        // No start match, no default => do nothing
                        cb({ code: errorCodes.ROUTE_NOT_FOUND, path: startPath }, null);
                    }
                })();
            } else {
                // Initialise router with provided start state
                router.setState(startState);
                done(null, startState);
            }

            return router;
        }

        function stop() {
            if (started) {
                router.setState(null);
                started = false;
                router.invokeEventListeners(constants.ROUTER_STOP);
            }

            return router;
        }
    }

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
            var i = void 0;

            var _loop = function _loop() {
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
                        if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
                }
            }

            return i;
        }

        var i = void 0;
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

    function resolve(functions, _ref, callback) {
        var isCancelled = _ref.isCancelled;
        var toState = _ref.toState;
        var fromState = _ref.fromState;
        var errorKey = _ref.errorKey;

        var remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

        var isState = function isState(obj) {
            return (typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj)) === 'object' && obj.name !== undefined && obj.params !== undefined && obj.path !== undefined;
        };
        var hasStateChanged = function hasStateChanged(state) {
            return state.name !== toState.name || state.params !== toState.params || state.path !== toState.path;
        };

        var processFn = function processFn(done) {
            if (!remainingFunctions.length) return true;

            var isMapped = typeof remainingFunctions[0] === 'string';
            var errBase = errorKey && isMapped ? babelHelpers.defineProperty({}, errorKey, remainingFunctions[0]) : {};
            var stepFn = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];

            // const len = stepFn.length;
            var res = stepFn.call(null, toState, fromState, done);
            if (isCancelled()) {
                done(null);
            } else if (typeof res === 'boolean') {
                done(res ? null : errBase);
            } else if (res && typeof res.then === 'function') {
                res.then(function (resVal) {
                    if (resVal instanceof Error) done({ error: resVal }, null);else done(null, resVal);
                }, function (err) {
                    if (err instanceof Error) {
                        console.error(err.stack || err);
                        done(babelHelpers.extends({}, errBase, { promiseError: err }), null);
                    } else {
                        done((typeof err === 'undefined' ? 'undefined' : babelHelpers.typeof(err)) === 'object' ? babelHelpers.extends({}, errBase, err) : errBase, null);
                    }
                });
            }
            // else: wait for done to be called

            return false;
        };

        var iterate = function iterate(err, val) {
            if (isCancelled()) {
                callback();
            } else if (err) {
                callback(err);
            } else {
                if (val && isState(val)) {
                    if (hasStateChanged(val)) console.error('[router5][transition] Warning: state values changed during transition process.');
                    toState = val;
                }
                remainingFunctions = remainingFunctions.slice(1);
                next();
            }
        };

        var next = function next() {
            if (isCancelled()) {
                callback();
            } else {
                var finished = processFn(iterate);
                if (finished) callback(null, toState);
            }
        };

        next();
    }

    function transition(router, toState, fromState, opts, callback) {
        var cancelled = false;
        var completed = false;
        var options = router.getOptions();

        var _router$getLifecycleF = router.getLifecycleFunctions();

        var _router$getLifecycleF2 = babelHelpers.slicedToArray(_router$getLifecycleF, 2);

        var canDeactivateFunctions = _router$getLifecycleF2[0];
        var canActivateFunctions = _router$getLifecycleF2[1];

        var middlewareFunctions = router.getMiddlewareFunctions();
        var isCancelled = function isCancelled() {
            return cancelled;
        };
        var cancel = function cancel() {
            if (!cancelled && !completed) {
                cancelled = true;
                callback({ code: errorCodes.TRANSITION_CANCELLED }, null);
            }
        };
        var done = function done(err, state) {
            completed = true;

            if (isCancelled()) {
                return;
            }

            if (!err && options.autoCleanUp) {
                (function () {
                    var activeSegments = nameToIDs(toState.name);
                    Object.keys(canDeactivateFunctions).forEach(function (name) {
                        if (activeSegments.indexOf(name) === -1) router.clearCanDeactivate(name);
                    });
                })();
            }

            callback(err, state || toState);
        };
        var makeError = function makeError(base, err) {
            return babelHelpers.extends({}, base, err instanceof Object ? err : { error: err });
        };

        var _transitionPath = transitionPath(toState, fromState);

        var toDeactivate = _transitionPath.toDeactivate;
        var toActivate = _transitionPath.toActivate;

        var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState };

        var canDeactivate = function canDeactivate(toState, fromState, cb) {
            var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
                return canDeactivateFunctions[name];
            }).reduce(function (fnMap, name) {
                return babelHelpers.extends({}, fnMap, babelHelpers.defineProperty({}, name, canDeactivateFunctions[name]));
            }, {});

            resolve(canDeactivateFunctionMap, babelHelpers.extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
                return cb(err ? makeError({ code: errorCodes.CANNOT_DEACTIVATE }, err) : null);
            });
        };

        var canActivate = function canActivate(toState, fromState, cb) {
            var canActivateFunctionMap = toActivate.filter(function (name) {
                return canActivateFunctions[name];
            }).reduce(function (fnMap, name) {
                return babelHelpers.extends({}, fnMap, babelHelpers.defineProperty({}, name, canActivateFunctions[name]));
            }, {});

            resolve(canActivateFunctionMap, babelHelpers.extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
                return cb(err ? makeError({ code: errorCodes.CANNOT_ACTIVATE }, err) : null);
            });
        };

        var middleware = !middlewareFunctions.length ? [] : function (toState, fromState, cb) {
            return resolve(middlewareFunctions, babelHelpers.extends({}, asyncBase), function (err, state) {
                return cb(err ? makeError({ code: errorCodes.TRANSITION_ERR }, err) : null, state || toState);
            });
        };

        var pipeline = (fromState && !opts.forceDeactivate ? [canDeactivate] : []).concat(canActivate).concat(middleware);

        resolve(pipeline, asyncBase, done);

        return cancel;
    }

    var noop$2 = function noop() {};

    function withNavigation(router) {
        var cancelCurrentTransition = void 0;

        router.navigate = navigate;
        router.navigateToDefault = navigateToDefault;
        router.transitionToState = transitionToState;
        router.cancel = cancel;

        function cancel() {
            if (cancelCurrentTransition) {
                cancelCurrentTransition('navigate');
                cancelCurrentTransition = null;
            }

            return router;
        }

        function navigate() {
            var name = arguments.length <= 0 ? undefined : arguments[0];
            var lastArg = arguments.length <= arguments.length - 1 + 0 ? undefined : arguments[arguments.length - 1 + 0];
            var done = typeof lastArg === 'function' ? lastArg : noop$2;
            var params = babelHelpers.typeof(arguments.length <= 1 ? undefined : arguments[1]) === 'object' ? arguments.length <= 1 ? undefined : arguments[1] : {};
            var opts = babelHelpers.typeof(arguments.length <= 2 ? undefined : arguments[2]) === 'object' ? arguments.length <= 2 ? undefined : arguments[2] : {};

            if (!router.isStarted()) {
                done({ code: errorCodes.ROUTER_NOT_STARTED });
                return;
            }

            var toState = router.buildState(name, params);

            if (!toState) {
                var err = { code: errorCodes.ROUTE_NOT_FOUND };
                done(err);
                router.invokeEventListeners(constants.TRANSITION_ERROR, null, router.getState(), err);
                return;
            }

            toState.path = router.buildPath(name, params);
            var sameStates = router.getState() ? router.areStatesEqual(router.getState(), toState, false) : false;

            // Do not proceed further if states are the same and no reload
            // (no desactivation and no callbacks)
            if (sameStates && !opts.reload) {
                var _err = { code: errorCodes.SAME_STATES };
                done(_err);
                router.invokeEventListeners(constants.TRANSITION_ERROR, toState, router.getState(), _err);
                return;
            }

            var fromState = sameStates ? null : router.getState();

            // Transitio
            return transitionToState(toState, fromState, opts, function (err, state) {
                if (err) {
                    if (err.redirect) {
                        var _err$redirect = err.redirect;
                        var _name = _err$redirect.name;
                        var _params = _err$redirect.params;


                        navigate(_name, _params, babelHelpers.extends({}, opts, { reload: true }), done);
                    } else {
                        done(err);
                    }
                } else {
                    router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, fromState, opts);
                    done(null, state);
                }
            });
        }

        function navigateToDefault() {
            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var done = arguments.length <= 1 || arguments[1] === undefined ? noop$2 : arguments[1];

            var options = router.getOptions();

            return navigate(options.defaultRoute, options.defaultParams, opts, done);
        }

        function transitionToState(toState, fromState) {
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var done = arguments.length <= 3 || arguments[3] === undefined ? noop$2 : arguments[3];

            cancel();
            router.invokeEventListeners(constants.TRANSITION_START, toState, fromState);

            cancelCurrentTransition = transition(router, toState, fromState, options, function (err, state) {
                cancelCurrentTransition = null;
                state = state || toState;

                if (err) {
                    if (err.code === errorCodes.TRANSITION_CANCELLED) {
                        router.invokeEventListeners(constants.TRANSITION_CANCELLED, toState, fromState);
                    } else {
                        router.invokeEventListeners(constants.TRANSITION_ERROR, toState, fromState, err);
                    }
                    done(err);
                } else {
                    router.setState(state);
                    done(null, state);
                }
            });

            return cancelCurrentTransition;
        }
    }

    function withMiddleware(router) {
        var middlewareFactories = [];
        var middlewareFunctions = [];

        router.useMiddleware = useMiddleware;
        router.getMiddlewareFunctions = getMiddlewareFunctions;
        router.clearMiddleware = clearMiddleware;

        function useMiddleware() {
            for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
                middlewares[_key] = arguments[_key];
            }

            middlewares.forEach(addMiddleware);

            return router;
        }

        function clearMiddleware() {
            middlewareFactories = [];
            middlewareFunctions = [];
        }

        function getMiddlewareFunctions() {
            return middlewareFunctions;
        }

        function addMiddleware(middleware) {
            middlewareFactories.push(middleware);
            startMiddleware(middleware);
        }

        function startMiddleware(middleware) {
            middlewareFunctions.push(router.executeFactory(middleware));
        }
    }

    var pluginMethods = ['onStart', 'onStop', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];

    function withPlugins(router) {
        var plugins = [];
        var removePluginListeners = [];

        router.usePlugin = usePlugin;
        router.hasPlugin = hasPlugin;

        function usePlugin() {
            for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
                plugins[_key] = arguments[_key];
            }

            plugins.forEach(addPlugin);
            return router;
        }

        function addPlugin(plugin) {
            if (!hasPlugin(plugin)) {
                plugins.push(plugin);
                startPlugin(plugin);
            }
        }

        function hasPlugin(pluginName) {
            return plugins.filter(function (p) {
                return p.pluginName === pluginName || p.name === pluginName;
            }).length > 0;
        }

        function startPlugin(plugin) {
            var appliedPlugin = router.executeFactory(plugin);

            var removeEventListeners = pluginMethods.map(function (methodName) {
                if (appliedPlugin[methodName]) {
                    return router.addEventListener(methodName.toLowerCase().replace(/^on/, '$$').replace(/transition/, '$$'), appliedPlugin[methodName]);
                }
            }).filter(Boolean);

            removePluginListeners.push.apply(removePluginListeners, babelHelpers.toConsumableArray(removeEventListeners));
        }
    }

    var toFunction = function toFunction(val) {
        return typeof val === 'function' ? val : function () {
            return function () {
                return val;
            };
        };
    };

    function withRouteLifecycle(router) {
        var canActivateFactories = {};
        var canActivateFunctions = {};
        var canDeactivateFactories = {};
        var canDeactivateFunctions = {};

        router.canDeactivate = canDeactivate;
        router.canActivate = canActivate;
        router.getLifecycleFunctions = getLifecycleFunctions;
        router.clearCanDeactivate = clearCanDeactivate;

        function getLifecycleFunctions() {
            return [canDeactivateFunctions, canActivateFunctions];
        }

        function canDeactivate(name, canDeactivateHandler) {
            var factory = toFunction(canDeactivateHandler);

            canDeactivateFactories[name] = factory;

            if (router.isStarted()) {
                canDeactivateFunctions[name] = router.executeFactory(factory);
            }

            return router;
        }

        function clearCanDeactivate(name) {
            canDeactivateFactories[name] = undefined;
            canDeactivateFunctions[name] = undefined;
        }

        function canActivate(name, canActivateHandler) {
            var factory = toFunction(canActivateHandler);
            canActivateFactories[name] = factory;

            if (router.isStarted()) {
                canActivateFunctions[name] = router.executeFactory(factory);
            }

            return router;
        }

        function executeFactories() {
            var reduceFactories = function reduceFactories(factories) {
                return Object.keys(factories).reduce(function (functionsMap, key) {
                    if (factories[key]) {
                        functionsMap[key] = router.executeFactory(factories[key]);
                    }
                    return functionsMap;
                }, {});
            };

            canActivateFunctions = reduceFactories(canActivateFactories);
            canDeactivateFunctions = reduceFactories(canDeactivateFactories);
        }

        router.addEventListener(constants.ROUTER_START, executeFactories);
    }

    var defaultOptions = {
        trailingSlash: 0,
        autoCleanUp: true,
        strictQueryParams: true,
        allowNotFound: false
    };

    function createRouter(routes, opts) {
        var routerState = null;
        var callbacks = {};
        var dependencies = {};
        var options = babelHelpers.extends({}, defaultOptions, opts);

        var router = {
            rootNode: rootNode,
            getOptions: getOptions,
            setOption: setOption,
            getState: getState,
            setState: setState,
            makeState: makeState,
            makeNotFoundState: makeNotFoundState,
            setDependency: setDependency,
            setDependencies: setDependencies,
            getDependencies: getDependencies,
            add: add,
            addNode: addNode,
            executeFactory: executeFactory,
            addEventListener: addEventListener,
            removeEventListener: removeEventListener,
            invokeEventListeners: invokeEventListeners
        };

        function invokeEventListeners(eventName) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            (callbacks[eventName] || []).forEach(function (cb) {
                return cb.apply(undefined, args);
            });
        }

        function removeEventListener(eventName, cb) {
            callbacks[eventName] = callbacks[eventName].filter(function (_cb) {
                return _cb !== cb;
            });
        }

        function addEventListener(eventName, cb) {
            callbacks[eventName] = (callbacks[eventName] || []).concat(cb);

            return function () {
                return removeEventListener(eventName, cb);
            };
        }

        withUtils(router);
        withPlugins(router);
        withMiddleware(router);
        withRouteLifecycle(router);
        withRouterLifecycle(router);
        withNavigation(router);

        var rootNode = routes instanceof RouteNode ? routes : new RouteNode('', '', routes, addCanActivate);

        router.rootNode = rootNode;

        return router;

        function addCanActivate(route) {
            if (route.canActivate) router.canActivate(route.name, route.canActivate);
        }

        function makeState(name, params, path, metaParams, source) {
            var state = {};
            var setProp = function setProp(key, value) {
                return Object.defineProperty(state, key, { value: value, enumerable: true });
            };
            setProp('name', name);
            setProp('params', params);
            setProp('path', path);
            if (metaParams || source) {
                var meta = { params: metaParams };

                if (source) meta.source = source;

                setProp('meta', meta);
            }
            return state;
        }

        function makeNotFoundState(path) {
            return makeState(constants.UNKNOWN_ROUTE, { path: path }, path, {});
        }

        function getState() {
            return routerState;
        }

        function setState(state) {
            routerState = state;
        }

        function getOptions() {
            return options;
        }

        function setOption(option, value) {
            options[option] = value;
            return router;
        }

        function setDependency(dependencyName, dependency) {
            dependencies[dependencyName] = dependency;
            return router;
        }

        function setDependencies(deps) {
            Object.keys(deps).forEach(function (depName) {
                dependencies[depName] = deps[depName];
            });
        }

        function getDependencies() {
            return dependencies;
        }

        function getInjectables() {
            return [router, dependencies];
        }

        function executeFactory(factoryFunction) {
            return factoryFunction.apply(undefined, babelHelpers.toConsumableArray(getInjectables()));
        }

        function add(routes) {
            rootNode.add(routes, addCanActivate);
            return router;
        }

        function addNode(name, path, canActivateHandler) {
            rootNode.addNode(name, path);
            if (canActivateHandler) router.canActivate(name, canActivateHandler);
            return router;
        }
    }

    /* istanbul ignore next */
    function loggerPlugin() {
        var startGroup = function startGroup() {
            return console.group('Router transition');
        };
        var endGroup = function endGroup() {
            return console.groupEnd('Router transition');
        };

        console.info('Router started');

        return {
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
            onTransitionCancel: function onTransitionCancel() {
                console.warn('Transition cancelled');
            },
            onTransitionError: function onTransitionError(toState, fromState, err) {
                console.warn('Transition error with code ' + err.code);
                endGroup();
            },
            onTransitionSuccess: function onTransitionSuccess() {
                console.log('Transition success');
                endGroup();
            }
        };
    };

    loggerPlugin.pluginName = 'LOGGER_PLUGIN';

    exports['default'] = createRouter;
    exports.createRouter = createRouter;
    exports.RouteNode = RouteNode;
    exports.loggerPlugin = loggerPlugin;
    exports.errorCodes = errorCodes;
    exports.transitionPath = transitionPath;
    exports.constants = constants;

    Object.defineProperty(exports, '__esModule', { value: true });

}));