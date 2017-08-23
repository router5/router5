(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.router5 = global.router5 || {})));
}(this, (function (exports) { 'use strict';

// Split path
var getPath = function getPath(path) {
    return path.split('?')[0];
};
var getSearch = function getSearch(path) {
    return path.split('?')[1];
};

// Search param name
var bracketTest = /\[\]$/;
var hasBrackets = function hasBrackets(paramName) {
    return bracketTest.test(paramName);
};
var withoutBrackets = function withoutBrackets(paramName) {
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

        return params.concat(split.length === 1 ? { name: name, value: true } : { name: name, value: decodeURIComponent(value) });
    }, []);
};

/**
 * Reduce a list of parameters (returned by `.parse()``) to an object (key-value pairs)
 * @param  {Array} paramList The list of parameters returned by `.parse()`
 * @return {Object}          The object of parameters (key-value pairs)
 */
var toObject = function toObject(paramList) {
    return paramList.reduce(function (params, _ref) {
        var name = _ref.name;
        var value = _ref.value;

        var isArray = hasBrackets(name);
        var currentValue = params[withoutBrackets(name)];

        if (currentValue === undefined) {
            params[withoutBrackets(name)] = isArray ? [value] : value;
        } else {
            params[withoutBrackets(name)] = [].concat(currentValue, value);
        }

        return params;
    }, {});
};

/**
 * Build a querystring from a list of parameters
 * @param  {Array} paramList The list of parameters (see `.parse()`)
 * @return {String}          The querystring
 */
var build = function build(paramList) {
    return paramList.filter(function (_ref2) {
        var value = _ref2.value;
        return value !== undefined && value !== null;
    }).map(function (_ref3) {
        var name = _ref3.name;
        var value = _ref3.value;
        return value === true ? name : name + '=' + encodeURIComponent(value);
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

    var remainingQueryParams = parse(querystring).filter(function (_ref4) {
        var name = _ref4.name;
        return paramsToOmit.indexOf(withoutBrackets(name)) === -1;
    });
    var remainingQueryString = build(remainingQueryParams);

    return remainingQueryString || '';
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
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





var defineProperty = function (obj, key, value) {
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

var _extends = Object.assign || function (target) {
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





















var slicedToArray = function () {
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













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var defaultOrConstrained = function defaultOrConstrained(match) {
    return '(' + (match ? match.replace(/(^<|>$)/g, '') : '[a-zA-Z0-9-_.~%\':]+') + ')';
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
    // regex:   match => new RegExp('(?=(\?|.*&)' + match[0] + '(?=(\=|&|$)))')
}, {
    // Query parameter: ?param1&param2
    //                   ?:param1&:param2
    name: 'query-parameter',
    pattern: /^(?:\?|&)(?:\:)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
    // regex:   match => new RegExp('(?=(\?|.*&)' + match[0] + '(?=(\=|&|$)))')
}, {
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

var exists = function exists(val) {
    return val !== undefined && val !== null;
};

var tokenise = function tokenise(str) {
    var tokens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

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

var upToDelimiter = function upToDelimiter(source, delimiter) {
    if (!delimiter) return source;

    return (/(\/)$/.test(source) ? source : source + '(\\/|\\?|\\.|;|$)'
    );
};

var appendQueryParam = function appendQueryParam(params, param) {
    var val = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (/\[\]$/.test(param)) {
        param = withoutBrackets(param);
        val = [val];
    }
    var existingVal = params[param];

    if (existingVal === undefined) params[param] = val;else params[param] = Array.isArray(existingVal) ? existingVal.concat(val) : [existingVal, val];

    return params;
};

var parseQueryParams = function parseQueryParams(path) {
    var searchPart = getSearch(path);
    if (!searchPart) return {};

    return toObject(parse(searchPart));
};

function _serialise(key, val) {
    if (Array.isArray(val)) {
        return val.map(function (v) {
            return _serialise(key, v);
        }).join('&');
    }

    if (val === true) {
        return key;
    }

    return key + '=' + val;
}

var Path = function () {
    createClass(Path, null, [{
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
        classCallCheck(this, Path);

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
        this.spatParams = this._getParams('url-parameter-splat');
        this.urlParams = this._getParams(/^url-parameter/);
        // Query params
        this.queryParams = this._getParams('query-parameter');
        this.queryParamsBr = this._getParams('query-parameter-bracket');
        // All params
        this.params = this.urlParams.concat(this.queryParams).concat(this.queryParamsBr);
        // Check if hasQueryParams
        // Regular expressions for url part only (full and partial match)
        this.source = this.tokens.filter(function (t) {
            return t.regex !== undefined;
        }).map(function (r) {
            return r.regex.source;
        }).join('');
    }

    createClass(Path, [{
        key: '_getParams',
        value: function _getParams(type) {
            var predicate = type instanceof RegExp ? function (t) {
                return type.test(t.type);
            } : function (t) {
                return t.type === type;
            };

            return this.tokens.filter(predicate).map(function (t) {
                return t.val[0];
            });
        }
    }, {
        key: '_isQueryParam',
        value: function _isQueryParam(name) {
            return this.queryParams.indexOf(name) !== -1 || this.queryParamsBr.indexOf(name) !== -1;
        }
    }, {
        key: '_urlTest',
        value: function _urlTest(path, regex) {
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
        key: 'test',
        value: function test(path, opts) {
            var _this2 = this;

            var options = _extends({ trailingSlash: false }, opts);
            // trailingSlash: falsy => non optional, truthy => optional
            var source = optTrailingSlash(this.source, options.trailingSlash);
            // Check if exact match
            var matched = this._urlTest(path, new RegExp('^' + source + (this.hasQueryParams ? '(\\?.*$|$)' : '$')));
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
        key: 'partialTest',
        value: function partialTest(path, opts) {
            var _this3 = this;

            var options = _extends({ delimited: true }, opts);
            // Check if partial match (start of given path matches regex)
            // trailingSlash: falsy => non optional, truthy => optional
            var source = upToDelimiter(this.source, options.delimited);
            var match = this._urlTest(path, new RegExp('^' + source));

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
        value: function build$$1() {
            var _this4 = this;

            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var options = _extends({ ignoreConstraints: false, ignoreSearch: false }, opts);
            var encodedParams = Object.keys(params).reduce(function (acc, key) {
                if (!exists(params[key])) {
                    return acc;
                }

                var val = params[key];
                var encode = _this4._isQueryParam(key) ? encodeURIComponent : encodeURI;

                if (typeof val === 'boolean') {
                    acc[key] = val;
                } else if (Array.isArray(val)) {
                    acc[key] = val.map(encode);
                } else {
                    acc[key] = encode(val);
                }

                return acc;
            }, {});

            // Check all params are provided (not search parameters which are optional)
            if (this.urlParams.some(function (p) {
                return !exists(encodedParams[p]);
            })) throw new Error('Missing parameters');

            // Check constraints
            if (!options.ignoreConstraints) {
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

            if (options.ignoreSearch) return base;

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

var noop = function noop() {};

var RouteNode = function () {
    function RouteNode() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var childRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cb = arguments[3];
        var parent = arguments[4];
        classCallCheck(this, RouteNode);

        this.name = name;
        this.absolute = /^~/.test(path);
        this.path = this.absolute ? path.slice(1) : path;
        this.parser = this.path ? new Path(this.path) : null;
        this.children = [];
        this.parent = parent;

        this.checkParents();

        this.add(childRoutes, cb);

        return this;
    }

    createClass(RouteNode, [{
        key: 'checkParents',
        value: function checkParents() {
            if (this.absolute && this.hasParentsParams()) {
                throw new Error('[RouteNode] A RouteNode with an abolute path cannot have parents with route parameters');
            }
        }
    }, {
        key: 'hasParentsParams',
        value: function hasParentsParams() {
            if (this.parent && this.parent.parser) {
                var parser = this.parent.parser;
                var hasParams = parser.hasUrlParams || parser.hasSpatParam || parser.hasMatrixParams || parser.hasQueryParams;

                return hasParams || this.parent.hasParentsParams();
            }

            return false;
        }
    }, {
        key: 'getNonAbsoluteChildren',
        value: function getNonAbsoluteChildren() {
            return this.children.filter(function (child) {
                return !child.absolute;
            });
        }
    }, {
        key: 'findAbsoluteChildren',
        value: function findAbsoluteChildren() {
            return this.children.reduce(function (absoluteChildren, child) {
                return absoluteChildren.concat(child.absolute ? child : []).concat(child.findAbsoluteChildren());
            }, []);
        }
    }, {
        key: 'findSlashChild',
        value: function findSlashChild() {
            var slashChildren = this.getNonAbsoluteChildren().filter(function (child) {
                return child.parser && /^\/(\?|$)/.test(child.parser.path);
            });

            return slashChildren[0];
        }
    }, {
        key: 'getParentSegments',
        value: function getParentSegments() {
            var segments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            return this.parent && this.parent.parser ? this.parent.getParentSegments(segments.concat(this.parent)) : segments.reverse();
        }
    }, {
        key: 'setParent',
        value: function setParent(parent) {
            this.parent = parent;
            this.checkParents();
        }
    }, {
        key: 'setPath',
        value: function setPath() {
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            this.path = path;
            this.parser = path ? new Path(path) : null;
        }
    }, {
        key: 'add',
        value: function add(route) {
            var _this = this;

            var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

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
            } else if (route instanceof RouteNode) {
                route.setParent(this);
            } else {
                if (!route.name || !route.path) {
                    throw new Error('RouteNode.add() expects routes to have a name and a path defined.');
                }
                originalRoute = route;
                route = new RouteNode(route.name, route.path, route.children, cb, this);
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
                    route.name = names[names.length - 1];
                    segments[segments.length - 1].add(route);
                } else {
                    throw new Error('Could not add route named \'' + route.name + '\', parent is missing.');
                }
            }

            if (originalRoute) {
                var fullName = route.getParentSegments([route]).map(function (_) {
                    return _.name;
                }).join('.');
                cb(_extends({}, originalRoute, {
                    name: fullName
                }));
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
            var trailingSlash = options.trailingSlash,
                strictQueryParams = options.strictQueryParams,
                strongMatching = options.strongMatching;

            var matchChildren = function matchChildren(nodes, pathSegment, segments) {
                var isRoot = nodes.length === 1 && nodes[0].name === '';
                // for (child of node.children) {

                var _loop = function _loop(i) {
                    var child = nodes[i];

                    // Partially match path
                    var match = void 0;
                    var remainingPath = void 0;

                    if (!child.children.length) {
                        match = child.parser.test(pathSegment, { trailingSlash: trailingSlash });
                    }

                    if (!match) {
                        match = child.parser.partialTest(pathSegment, { delimiter: strongMatching });
                    }

                    if (match) {
                        // Remove consumed segment from path
                        var consumedPath = child.parser.build(match, { ignoreSearch: true });
                        if (trailingSlash && !child.children.length) {
                            consumedPath = consumedPath.replace(/\/$/, '');
                        }

                        remainingPath = pathSegment.replace(consumedPath, '');

                        if (trailingSlash && !child.children.length) {
                            remainingPath = remainingPath.replace(/^\/\?/, '?');
                        }

                        var search = omit(getSearch(pathSegment.replace(consumedPath, '')), child.parser.queryParams.concat(child.parser.queryParamsBr));
                        remainingPath = getPath(remainingPath) + (search ? '?' + search : '');
                        if (trailingSlash && !isRoot && remainingPath === '/' && !/\/$/.test(consumedPath)) {
                            remainingPath = '';
                        }

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
                                var name = _ref.name,
                                    value = _ref.value;
                                return segments.params[name] = value;
                            });
                            return {
                                v: segments
                            };
                        }
                        // Continue matching on non absolute children
                        var children = child.getNonAbsoluteChildren();
                        // If no children to match against but unmatched path left
                        if (!children.length) {
                            return {
                                v: null
                            };
                        }
                        // Else: remaining path and children
                        return {
                            v: matchChildren(children, remainingPath, segments)
                        };
                    }
                };

                for (var i = 0; i < nodes.length; i += 1) {
                    var _ret = _loop(i);

                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                }

                return null;
            };

            var topLevelNodes = this.parser ? [this] : this.children;
            var startingNodes = topLevelNodes.reduce(function (nodes, node) {
                return nodes.concat(node, node.findAbsoluteChildren());
            }, []);

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
        value: function getPath$$1(routeName) {
            return this.getPathFromSegments(this.getSegmentsByName(routeName));
        }
    }, {
        key: 'buildPathFromSegments',
        value: function buildPathFromSegments(segments) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (!segments) return null;

            var searchParams = [];
            var nonSearchParams = [];

            for (var i = 0; i < segments.length; i += 1) {
                var parser = segments[i].parser;
                searchParams.push.apply(searchParams, toConsumableArray(parser.queryParams));
                searchParams.push.apply(searchParams, toConsumableArray(parser.queryParamsBr));
                nonSearchParams.push.apply(nonSearchParams, toConsumableArray(parser.urlParams));
                nonSearchParams.push.apply(nonSearchParams, toConsumableArray(parser.spatParams));
            }

            if (!options.strictQueryParams) {
                var extraParams = Object.keys(params).reduce(function (acc, p) {
                    return searchParams.indexOf(p) === -1 && nonSearchParams.indexOf(p) === -1 ? acc.concat(p) : acc;
                }, []);
                searchParams.push.apply(searchParams, toConsumableArray(extraParams));
            }

            var searchPart = !searchParams.length ? null : searchParams.filter(function (p) {
                if (Object.keys(params).indexOf(withoutBrackets(p)) === -1) {
                    return false;
                }

                var val = params[withoutBrackets(p)];

                if (Array.isArray(val)) {
                    return val.length > 0;
                }

                return val !== undefined && val !== null;
            }).map(function (p) {
                var val = params[withoutBrackets(p)];
                var encodedVal = Array.isArray(val) ? val.map(encodeURIComponent) : encodeURIComponent(val);

                return Path.serialise(p, encodedVal);
            }).join('&');

            var path = segments.reduce(function (path, segment) {
                var segmentPath = segment.parser.build(params, { ignoreSearch: true });

                return segment.absolute ? segmentPath : path + segmentPath;
            }, '');

            var finalPath = path;

            if (options.trailingSlash === true) {
                finalPath = /\/$/.test(path) ? path : path + '/';
            } else if (options.trailingSlash === false && path !== '/') {
                finalPath = /\/$/.test(path) ? path.slice(0, -1) : path;
            }

            return finalPath + (searchPart ? '?' + searchPart : '');
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
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var defaultOptions = { strictQueryParams: true };
            var options = _extends({}, defaultOptions, opts);
            var path = this.buildPathFromSegments(this.getSegmentsByName(routeName), params, options);

            return path;
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
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
            var defaultOptions = { trailingSlash: false, strictQueryParams: true, strongMatching: true };
            var opts = _extends({}, defaultOptions, options);
            var matchedSegments = this.getSegmentsMatchingPath(path, opts);

            if (matchedSegments) {
                if (matchedSegments[0].absolute) {
                    var firstSegmentParams = matchedSegments[0].getParentSegments();

                    matchedSegments.reverse();
                    matchedSegments.push.apply(matchedSegments, toConsumableArray(firstSegmentParams));
                    matchedSegments.reverse();
                }

                var lastSegment = matchedSegments[matchedSegments.length - 1];
                var lastSegmentSlashChild = lastSegment.findSlashChild();

                if (lastSegmentSlashChild) {
                    matchedSegments.push(lastSegmentSlashChild);
                }
            }

            return this.buildStateFromSegments(matchedSegments);
        }
    }]);
    return RouteNode;
}();

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

function withUtils(router) {
    var options = router.getOptions();

    router.isActive = isActive;
    router.areStatesEqual = areStatesEqual;
    router.areStatesDescendants = areStatesDescendants;
    router.buildPath = buildPath;
    router.buildState = buildState;
    router.matchPath = matchPath;
    router.setRootPath = setRootPath;

    /**
     * Check if a route is currently active
     * @param  {String}  name                     The route name
     * @param  {Object}  params                   The route params
     * @param  {Boolean} [strictEquality=false]   Whether to check if the given route is the active route, or part of the active route
     * @param  {Boolean} [ignoreQueryParams=true] Whether to ignore query parameters
     * @return {Boolean}                          Whether the given route is active
     */
    function isActive(name) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var strictEquality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var ignoreQueryParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        var activeState = router.getState();

        if (!activeState) return false;

        if (strictEquality || activeState.name === name) {
            return areStatesEqual(router.makeState(name, params), activeState, ignoreQueryParams);
        }

        return areStatesDescendants(router.makeState(name, params), activeState);
    }

    /**
     * Compare two route state objects
     * @param  {Object}  state1            The route state
     * @param  {Object}  state2            The other route state
     * @param  {Boolean} ignoreQueryParams Whether to ignore query parameters or not
     * @return {Boolean}                   Whether the two route state are equal or not
     */
    function areStatesEqual(state1, state2) {
        var ignoreQueryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (state1.name !== state2.name) return false;

        var getUrlParams = function getUrlParams(name) {
            return router.rootNode.getSegmentsByName(name).map(function (segment) {
                return segment.parser['urlParams'];
            }).reduce(function (params, p) {
                return params.concat(p);
            }, []);
        };

        var state1Params = ignoreQueryParams ? getUrlParams(state1.name) : Object.keys(state1.params);
        var state2Params = ignoreQueryParams ? getUrlParams(state2.name) : Object.keys(state2.params);

        return state1Params.length === state2Params.length && state1Params.every(function (p) {
            return state1.params[p] === state2.params[p];
        });
    }

    /**
     * Check if two states are related
     * @param  {State} parentState  The parent state
     * @param  {State} childState   The child state
     * @return {Boolean}            Whether the two states are descendants or not
     */
    function areStatesDescendants(parentState, childState) {
        var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
        if (!regex.test(childState.name)) return false;
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(function (p) {
            return parentState.params[p] === childState.params[p];
        });
    }

    /**
     * Build a path
     * @param  {String} route  The route name
     * @param  {Object} params The route params
     * @return {String}        The path
     */
    function buildPath(route, params) {
        if (route === constants.UNKNOWN_ROUTE) {
            return params.path;
        }

        var useTrailingSlash = options.useTrailingSlash,
            strictQueryParams = options.strictQueryParams;

        return router.rootNode.buildPath(route, params, {
            trailingSlash: useTrailingSlash,
            strictQueryParams: strictQueryParams
        });
    }

    function buildState(route, params) {
        return router.rootNode.buildState(route, params);
    }

    /**
     * Match a path
     * @param  {String} path     The path to match
     * @param  {String} [source] The source (optional, used internally)
     * @return {Object}          The matched state (null if unmatched)
     */
    function matchPath(path, source) {
        var trailingSlash = options.trailingSlash,
            strictQueryParams = options.strictQueryParams,
            strongMatching = options.strongMatching;

        var match = router.rootNode.matchPath(path, {
            trailingSlash: trailingSlash,
            strictQueryParams: strictQueryParams,
            strongMatching: strongMatching
        });

        if (match) {
            var name = match.name,
                params = match.params,
                _meta = match._meta;

            var builtPath = options.useTrailingSlash === undefined ? path : router.buildPath(name, params);
            var routeName = router.forwardMap[name] || name;

            return router.makeState(routeName, params, builtPath, _meta, source);
        }

        return null;
    }

    /**
     * Set the root node path, use carefully. It can be used to set app-wide allowed query parameters.
     * @param {String} rootPath The root node path
     */
    function setRootPath(rootPath) {
        router.rootNode.setPath(rootPath);
    }
}

var noop$1 = function noop() {};

function withRouterLifecycle(router) {
    var started = false;
    var options = router.getOptions();

    router.isStarted = isStarted;
    router.start = start;
    router.stop = stop;

    /**
     * Check if the router is started
     * @return {Boolean} Whether the router is started or not
     */
    function isStarted() {
        return started;
    }

    /**
     * Start the router
     * @param  {String|Object} startPathOrState The start path or state. This is optional when using the browser plugin.
     * @param  {Function}      done             A done node style callback (err, state)
     * @return {Object}                         The router instance
     */
    function start() {
        var _ref;

        var lastArg = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
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
            var invokeErrCb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (!err) router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, null, { replace: true });
            if (err && invokeErrCb) router.invokeEventListeners(constants.TRANSITION_ERROR, state, null, err);
            done(err, state);
        };

        if (startPathOrState === undefined && !options.defaultRoute) {
            return cb({ code: errorCodes.NO_START_PATH_OR_STATE });
        }
        if (typeof startPathOrState === 'string') {
            startPath = startPathOrState;
        } else if ((typeof startPathOrState === 'undefined' ? 'undefined' : _typeof(startPathOrState)) === 'object') {
            startState = startPathOrState;
        }

        if (!startState) {
            // If no supplied start state, get start state
            startState = startPath === undefined ? null : router.matchPath(startPath);

            // Navigate to default function
            var navigateToDefault = function navigateToDefault() {
                return router.navigateToDefault({ replace: true }, done);
            };
            var redirect = function redirect(route) {
                return router.navigate(route.name, route.params, { replace: true, reload: true }, done);
            };
            var transitionToState = function transitionToState(state) {
                router.transitionToState(state, router.getState(), {}, function (err, state) {
                    if (!err) cb(null, state);else if (err.redirect) redirect(err.redirect);else if (options.defaultRoute) navigateToDefault();else cb(err, null, false);
                });
            };

            // If matched start path
            if (startState) {
                transitionToState(startState);
            } else if (options.defaultRoute) {
                // If default, navigate to default
                navigateToDefault();
            } else if (options.allowNotFound) {
                transitionToState(router.makeNotFoundState(startPath));
            } else {
                // No start match, no default => do nothing
                cb({ code: errorCodes.ROUTE_NOT_FOUND, path: startPath }, null);
            }
        } else {
            // Initialise router with provided start state
            router.setState(startState);
            cb(null, startState);
        }

        return router;
    }

    /**
     * Stop the router
     * @return {Object} The router instance
     */
    function stop() {
        if (started) {
            router.setState(null);
            started = false;
            router.invokeEventListeners(constants.ROUTER_STOP);
        }

        return router;
    }
}

var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

function nameToIDs(name) {
    return name.split('.').reduce(function (ids, name) {
        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
    }, []);
}

function exists$1(val) {
    return val !== undefined && val !== null;
}

function hasMetaParams(state) {
    return state && state.meta && state.meta.params;
}

function extractSegmentParams(name, state) {
    if (!exists$1(state.meta.params[name])) return {};

    return Object.keys(state.meta.params[name]).reduce(function (params, p) {
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
                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof$1(_ret)) === "object") return _ret.v;
            }
        }

        return i;
    }

    var i = void 0;
    if (!fromState) {
        i = 0;
    } else if (!hasMetaParams(fromState) && !hasMetaParams(toState)) {
        console.warn('[router5-transition-path] Some states are missing metadata, reloading all segments');
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
    var isCancelled = _ref.isCancelled,
        toState = _ref.toState,
        fromState = _ref.fromState,
        errorKey = _ref.errorKey;

    var remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

    var isState = function isState(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.name !== undefined && obj.params !== undefined && obj.path !== undefined;
    };
    var hasStateChanged = function hasStateChanged(state) {
        return state.name !== toState.name || state.params !== toState.params || state.path !== toState.path;
    };

    var processFn = function processFn(done) {
        if (!remainingFunctions.length) return true;

        var isMapped = typeof remainingFunctions[0] === 'string';
        var errBase = errorKey && isMapped ? defineProperty({}, errorKey, remainingFunctions[0]) : {};
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
                    done(_extends({}, errBase, { promiseError: err }), null);
                } else {
                    done((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? _extends({}, errBase, err) : errBase, null);
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

function transition$1(router, toState, fromState, opts, callback) {
    var cancelled = false;
    var completed = false;
    var options = router.getOptions();

    var _router$getLifecycleF = router.getLifecycleFunctions(),
        _router$getLifecycleF2 = slicedToArray(_router$getLifecycleF, 2),
        canDeactivateFunctions = _router$getLifecycleF2[0],
        canActivateFunctions = _router$getLifecycleF2[1];

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
            var activeSegments = nameToIDs(toState.name);
            Object.keys(canDeactivateFunctions).forEach(function (name) {
                if (activeSegments.indexOf(name) === -1) router.clearCanDeactivate(name);
            });
        }

        callback(err, state || toState);
    };
    var makeError = function makeError(base, err) {
        return _extends({}, base, err instanceof Object ? err : { error: err });
    };

    var isUnknownRoute = toState.name === constants.UNKNOWN_ROUTE;
    var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState };

    var _transitionPath = transitionPath(toState, fromState),
        toDeactivate = _transitionPath.toDeactivate,
        toActivate = _transitionPath.toActivate;

    var canDeactivate = !fromState || opts.forceDeactivate ? [] : function (toState, fromState, cb) {
        var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
            return canDeactivateFunctions[name];
        }).reduce(function (fnMap, name) {
            return _extends({}, fnMap, defineProperty({}, name, canDeactivateFunctions[name]));
        }, {});

        resolve(canDeactivateFunctionMap, _extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: errorCodes.CANNOT_DEACTIVATE }, err) : null);
        });
    };

    var canActivate = isUnknownRoute ? [] : function (toState, fromState, cb) {
        var canActivateFunctionMap = toActivate.filter(function (name) {
            return canActivateFunctions[name];
        }).reduce(function (fnMap, name) {
            return _extends({}, fnMap, defineProperty({}, name, canActivateFunctions[name]));
        }, {});

        resolve(canActivateFunctionMap, _extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: errorCodes.CANNOT_ACTIVATE }, err) : null);
        });
    };

    var middleware = !middlewareFunctions.length ? [] : function (toState, fromState, cb) {
        return resolve(middlewareFunctions, _extends({}, asyncBase), function (err, state) {
            return cb(err ? makeError({ code: errorCodes.TRANSITION_ERR }, err) : null, state || toState);
        });
    };

    var pipeline = [].concat(canDeactivate).concat(canActivate).concat(middleware);

    resolve(pipeline, asyncBase, done);

    return cancel;
}

var noop$2 = function noop() {};

function withNavigation(router) {
    var cancelCurrentTransition = void 0;

    router.forwardMap = {};
    router.navigate = navigate;
    router.navigateToDefault = navigateToDefault;
    router.transitionToState = transitionToState;
    router.cancel = cancel;
    router.forward = forward;

    /**
     * Cancel the current transition if there is one
     * @return {Object} The router instance
     */
    function cancel() {
        if (cancelCurrentTransition) {
            cancelCurrentTransition('navigate');
            cancelCurrentTransition = null;
        }

        return router;
    }

    /**
     * Forward a route to another route, when calling navigate.
     * Route parameters for the two routes should match to avoid issues.
     * @param  {String}   fromRoute      The route name
     * @param  {String}   toRoute  The route params
     */
    function forward(fromRoute, toRoute) {
        router.forwardMap[fromRoute] = toRoute;

        return router;
    }

    /**
     * Navigate to a route
     * @param  {String}   routeName      The route name
     * @param  {Object}   [routeParams]  The route params
     * @param  {Object}   [options]      The navigation options (`replace`, `reload`)
     * @param  {Function} [done]         A done node style callback (err, state)
     * @return {Function}                A cancel function
     */
    function navigate() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var name = router.forwardMap[args[0]] || args[0];
        var lastArg = args[args.length - 1];
        var done = typeof lastArg === 'function' ? lastArg : noop$2;
        var params = _typeof(args[1]) === 'object' ? args[1] : {};
        var opts = _typeof(args[2]) === 'object' ? args[2] : {};

        if (!router.isStarted()) {
            done({ code: errorCodes.ROUTER_NOT_STARTED });
            return;
        }

        var route = router.buildState(name, params);

        if (!route) {
            var err = { code: errorCodes.ROUTE_NOT_FOUND };
            done(err);
            router.invokeEventListeners(constants.TRANSITION_ERROR, null, router.getState(), err);
            return;
        }

        var toState = router.makeState(route.name, route.params, router.buildPath(name, params), route._meta);
        var sameStates = router.getState() ? router.areStatesEqual(router.getState(), toState, false) : false;

        // Do not proceed further if states are the same and no reload
        // (no deactivation and no callbacks)
        if (sameStates && !opts.reload) {
            var _err = { code: errorCodes.SAME_STATES };
            done(_err);
            router.invokeEventListeners(constants.TRANSITION_ERROR, toState, router.getState(), _err);
            return;
        }

        var fromState = sameStates ? null : router.getState();

        // Transition
        return transitionToState(toState, fromState, opts, function (err, state) {
            if (err) {
                if (err.redirect) {
                    var _err$redirect = err.redirect,
                        _name = _err$redirect.name,
                        _params = _err$redirect.params;


                    navigate(_name, _params, _extends({}, opts, { reload: true }), done);
                } else {
                    done(err);
                }
            } else {
                router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, fromState, opts);
                done(null, state);
            }
        });
    }

    /**
     * Navigate to the default route (if defined)
     * @param  {Object}   [opts] The navigation options
     * @param  {Function} [done] A done node style callback (err, state)
     * @return {Function}        A cancel function
     */
    function navigateToDefault() {
        var opts = _typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object' ? arguments.length <= 0 ? undefined : arguments[0] : {};
        var done = arguments.length === 2 ? arguments.length <= 1 ? undefined : arguments[1] : typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function' ? arguments.length <= 0 ? undefined : arguments[0] : noop$2;
        var options = router.getOptions();

        if (options.defaultRoute) {
            return navigate(options.defaultRoute, options.defaultParams, opts, done);
        }

        return function () {};
    }

    function transitionToState(toState, fromState) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop$2;

        cancel();
        router.invokeEventListeners(constants.TRANSITION_START, toState, fromState);

        cancelCurrentTransition = transition$1(router, toState, fromState, options, function (err, state) {
            cancelCurrentTransition = null;
            state = state || toState;

            if (err) {
                if (err.code === errorCodes.TRANSITION_CANCELLED) {
                    router.invokeEventListeners(constants.TRANSITION_CANCEL, toState, fromState);
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
    router.getMiddlewareFactories = getMiddlewareFactories;
    router.getMiddlewareFunctions = getMiddlewareFunctions;
    router.clearMiddleware = clearMiddleware;

    /**
     * Register middleware functions.
     * @param  {...Function} middlewares The middleware functions
     * @return {Object}                  The router instance
     */
    function useMiddleware() {
        for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
            middlewares[_key] = arguments[_key];
        }

        middlewares.forEach(addMiddleware);

        return router;
    }

    /**
     * Remove all middleware functions
     * @return {Object} The router instance
     */
    function clearMiddleware() {
        middlewareFactories = [];
        middlewareFunctions = [];

        return router;
    }

    function getMiddlewareFactories() {
        return middlewareFactories;
    }

    function getMiddlewareFunctions() {
        return middlewareFunctions;
    }

    function addMiddleware(middleware) {
        middlewareFactories.push(middleware);
        middlewareFunctions.push(router.executeFactory(middleware));
    }
}

var pluginMethods = ['onStart', 'onStop', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];

function withPlugins(router) {
    var plugins = [];
    var removePluginListeners = [];

    router.usePlugin = usePlugin;
    router.hasPlugin = hasPlugin;
    router.getPlugins = getPlugins;

    function getPlugins() {
        return plugins;
    }

    /**
     * Use plugins
     * @param  {...Function} plugins An argument list of plugins
     * @return {Object}              The router instance
     */
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

    /**
     * Check if a plugin has already been registered.
     * @param  {String}  pluginName The plugin name
     * @return {Boolean}            Whether the plugin has been registered
     */
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

        removePluginListeners.push.apply(removePluginListeners, toConsumableArray(removeEventListeners));
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
    var canDeactivateFactories = {};
    var canActivateFactories = {};
    var canDeactivateFunctions = {};
    var canActivateFunctions = {};

    router.canDeactivate = canDeactivate;
    router.canActivate = canActivate;
    router.getLifecycleFactories = getLifecycleFactories;
    router.getLifecycleFunctions = getLifecycleFunctions;
    router.clearCanDeactivate = clearCanDeactivate;

    function getLifecycleFactories() {
        return [canDeactivateFactories, canActivateFactories];
    }

    function getLifecycleFunctions() {
        return [canDeactivateFunctions, canActivateFunctions];
    }

    /**
     * Register a canDeactivate handler or specify a if a route can be deactivated
     * @param  {String} name                           The route name
     * @param  {Function|Boolean} canDeactivateHandler The canDeactivate handler or boolean
     * @return {Object}                                The router instance
     */
    function canDeactivate(name, canDeactivateHandler) {
        var factory = toFunction(canDeactivateHandler);

        canDeactivateFactories[name] = factory;
        canDeactivateFunctions[name] = router.executeFactory(factory);

        return router;
    }

    /**
     * Remove a canDeactivate handler for a route
     * @param  {String} name The route name
     * @return {Object}      The router instance
     */
    function clearCanDeactivate(name) {
        canDeactivateFactories[name] = undefined;
        canDeactivateFunctions[name] = undefined;

        return router;
    }

    /**
     * Register a canActivate handler or specify a if a route can be deactivated
     * @param  {String} name                         The route name
     * @param  {Function|Boolean} canActivateHandler The canActivate handler or boolean
     * @return {Object}                              The router instance
     */
    function canActivate(name, canActivateHandler) {
        var factory = toFunction(canActivateHandler);

        canActivateFactories[name] = factory;
        canActivateFunctions[name] = router.executeFactory(factory);

        return router;
    }
}

function withCloning(router, createRouter) {
    router.clone = clone;

    /**
     * Clone the current router configuration. The new returned router will be non-started,
     * with a null state
     * @param  {[type]} deps [description]
     * @return {[type]}      [description]
     */
    function clone() {
        var deps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var clonedDependencies = _extends({}, router.getDependencies(), deps);
        var clonedRouter = createRouter(router.rootNode, router.getOptions(), clonedDependencies);

        clonedRouter.useMiddleware.apply(clonedRouter, toConsumableArray(router.getMiddlewareFactories()));
        clonedRouter.usePlugin.apply(clonedRouter, toConsumableArray(router.getPlugins()));

        var _router$getLifecycleF = router.getLifecycleFactories(),
            _router$getLifecycleF2 = slicedToArray(_router$getLifecycleF, 2),
            canDeactivateFactories = _router$getLifecycleF2[0],
            canActivateFactories = _router$getLifecycleF2[1];

        Object.keys(canDeactivateFactories).forEach(function (name) {
            return clonedRouter.canDeactivate(name, canDeactivateFactories[name]);
        });
        Object.keys(canActivateFactories).forEach(function (name) {
            return clonedRouter.canActivate(name, canActivateFactories[name]);
        });

        return clonedRouter;
    }
}

var defaultOptions = {
    trailingSlash: 0,
    useTrailingSlash: undefined,
    autoCleanUp: true,
    strictQueryParams: false,
    allowNotFound: false,
    strongMatching: true
};

/**
 * Create a router
 * @param  {Array}  [routes]          The routes
 * @param  {Object} [options={}]      The router options
 * @param  {Object} [dependencies={}] The router dependencies
 * @return {Object}                   The router instance
 */
function createRouter$1(routes) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var routerState = null;
    var stateId = 0;
    var callbacks = {};
    var dependencies = deps;
    var options = _extends({}, defaultOptions);

    Object.keys(opts).forEach(function (opt) {
        return setOption(opt, opts[opt]);
    });

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

    /**
     * Invoke all event listeners by event name. Possible event names are listed under constants
     * (`import { constants } from 'router5'`): `ROUTER_START`, `ROUTER_STOP`, `TRANSITION_START`,
     * `TRANSITION_CANCEL`, `TRANSITION_SUCCESS`, `TRANSITION_ERROR`.
     * This method is used internally and should not be invoked directly, but it can be useful for
     * testing purposes.
     * @private
     * @name invokeEventListeners
     * @param  {String}    eventName The event name
     */
    function invokeEventListeners(eventName) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        (callbacks[eventName] || []).forEach(function (cb) {
            return cb.apply(undefined, args);
        });
    }

    /**
     * Removes an event listener
     * @private
     * @param  {String}   eventName The event name
     * @param  {Function} cb        The callback to remove
     */
    function removeEventListener(eventName, cb) {
        callbacks[eventName] = callbacks[eventName].filter(function (_cb) {
            return _cb !== cb;
        });
    }

    /**
     * Add an event listener
     * @private
     * @param {String}   eventName The event name
     * @param {Function} cb        The callback to add
     */
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
    withCloning(router, createRouter$1);

    var rootNode = routes instanceof RouteNode ? routes : new RouteNode('', '', routes, onRouteAdded);

    router.rootNode = rootNode;

    return router;

    function onRouteAdded(route) {
        if (route.canActivate) router.canActivate(route.name, route.canActivate);

        if (route.forwardTo) router.forward(route.name, route.forwardTo);
    }

    /**
     * Build a state object
     * @param  {String} name         The state name
     * @param  {Object} params       The state params
     * @param  {String} path         The state path
     * @param  {Object} [metaParams] Description of the state params
     * @param  {String} [source]     The source of the routing state
     * @return {Object}              The state object
     */
    function makeState(name, params, path, metaParams, source) {
        var state = {};
        var setProp = function setProp(key, value) {
            return Object.defineProperty(state, key, { value: value, enumerable: true });
        };
        setProp('name', name);
        setProp('params', params);
        setProp('path', path);

        if (metaParams || source) {
            stateId += 1;
            var meta = { params: metaParams, id: stateId };

            if (source) meta.source = source;

            setProp('meta', meta);
        }

        return state;
    }

    /**
     * Build a not found state for a given path
     * @param  {String} path The unmatched path
     * @return {Object}      The not found state object
     */
    function makeNotFoundState(path) {
        return makeState(constants.UNKNOWN_ROUTE, { path: path }, path, {});
    }

    /**
     * Get the current router state
     * @return {Object} The current state
     */
    function getState() {
        return routerState;
    }

    /**
     * Set the current router state
     * @param {Object} state The state object
     */
    function setState(state) {
        routerState = state;
    }

    /**
     * Get router options
     * @return {Object} The router options
     */
    function getOptions() {
        return options;
    }

    /**
     * Set an option
     * @param  {String} option The option name
     * @param  {*}      value  The option value
     * @return {Object}       The router instance
     */
    function setOption(option, value) {
        if (option === 'useTrailingSlash' && value !== undefined) {
            options.trailingSlash = true;
        }
        options[option] = value;
        return router;
    }

    /**
     * Set a router dependency
     * @param  {String} dependencyName The dependency name
     * @param  {*}      dependency     The dependency
     * @return {Object}                The router instance
     */
    function setDependency(dependencyName, dependency) {
        dependencies[dependencyName] = dependency;
        return router;
    }

    /**
     * Add dependencies
     * @param { Object} deps A object of dependencies (key-value pairs)
     * @return {Object}      The router instance
     */
    function setDependencies(deps) {
        Object.keys(deps).forEach(function (depName) {
            dependencies[depName] = deps[depName];
        });

        return router;
    }

    /**
     * Get dependencies
     * @return {Object} The dependencies
     */
    function getDependencies() {
        return dependencies;
    }

    function getInjectables() {
        return [router, getDependencies()];
    }

    function executeFactory(factoryFunction) {
        return factoryFunction.apply(undefined, toConsumableArray(getInjectables()));
    }

    /**
     * Add routes
     * @param  {Array} routes A list of routes to add
     * @return {Object}       The router instance
     */
    function add(routes) {
        rootNode.add(routes, onRouteAdded);
        return router;
    }

    /**
     * Add a single route (node)
     * @param {String} name                   The route name (full name)
     * @param {String} path                   The route path (from parent)
     * @param {Function} [canActivateHandler] The canActivate handler for this node
     */
    function addNode(name, path, canActivateHandler) {
        router.rootNode.addNode(name, path);
        if (canActivateHandler) router.canActivate(name, canActivateHandler);
        return router;
    }
}

/* istanbul ignore next */
/*eslint no-console: 0*/

function loggerPlugin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var group = options.collapsed ? console.groupCollapsed : console.group;
    var startGroup = function startGroup() {
        return group('Router transition');
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
}

loggerPlugin.pluginName = 'LOGGER_PLUGIN';

exports['default'] = createRouter$1;
exports.createRouter = createRouter$1;
exports.RouteNode = RouteNode;
exports.loggerPlugin = loggerPlugin;
exports.errorCodes = errorCodes;
exports.transitionPath = transitionPath;
exports.constants = constants;

Object.defineProperty(exports, '__esModule', { value: true });

})));
