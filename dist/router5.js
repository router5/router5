(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.router5 = {})));
}(this, (function (exports) { 'use strict';

    var makeOptions = function makeOptions(opts) {
        if (opts === void 0) {
            opts = {};
        }
        return {
            arrayFormat: opts.arrayFormat || 'none',
            booleanFormat: opts.booleanFormat || 'none',
            nullFormat: opts.nullFormat || 'default'
        };
    };
    var encodeValue = function encodeValue(value) {
        return encodeURIComponent(value);
    };
    var decodeValue = function decodeValue(value) {
        return decodeURIComponent(value);
    };
    var encodeBoolean = function encodeBoolean(name, value, opts) {
        if (opts.booleanFormat === 'empty-true' && value) {
            return name;
        }
        var encodedValue;
        if (opts.booleanFormat === 'unicode') {
            encodedValue = value ? '✓' : '✗';
        } else {
            encodedValue = value.toString();
        }
        return name + "=" + encodedValue;
    };
    var encodeNull = function encodeNull(name, opts) {
        if (opts.nullFormat === 'hidden') {
            return '';
        }
        if (opts.nullFormat === 'string') {
            return name + "=null";
        }
        return name;
    };
    var getNameEncoder = function getNameEncoder(opts) {
        if (opts.arrayFormat === 'index') {
            return function (name, index) {
                return name + "[" + index + "]";
            };
        }
        if (opts.arrayFormat === 'brackets') {
            return function (name) {
                return name + "[]";
            };
        }
        return function (name) {
            return name;
        };
    };
    var encodeArray = function encodeArray(name, arr, opts) {
        var encodeName = getNameEncoder(opts);
        return arr.map(function (val, index) {
            return encodeName(name, index) + "=" + encodeValue(val);
        }).join('&');
    };
    var encode = function encode(name, value, opts) {
        if (value === null) {
            return encodeNull(name, opts);
        }
        if (typeof value === 'boolean') {
            return encodeBoolean(name, value, opts);
        }
        if (Array.isArray(value)) {
            return encodeArray(name, value, opts);
        }
        return name + "=" + encodeValue(value);
    };
    var decode = function decode(value, opts) {
        if (value === undefined) {
            return opts.booleanFormat === 'empty-true' ? true : null;
        }
        if (opts.booleanFormat === 'string') {
            if (value === 'true') {
                return true;
            }
            if (value === 'false') {
                return false;
            }
        } else if (opts.booleanFormat === 'unicode') {
            if (value === '✓') {
                return true;
            }
            if (value === '✗') {
                return false;
            }
        } else if (opts.nullFormat === 'string') {
            if (value === 'null') {
                return null;
            }
        }
        return decodeValue(value);
    };

    var getSearch = function getSearch(path) {
        var pos = path.indexOf('?');
        if (pos === -1) {
            return path;
        }
        return path.slice(pos + 1);
    };
    var isSerialisable = function isSerialisable(val) {
        return val !== undefined;
    };
    var parseName = function parseName(name) {
        var bracketPosition = name.indexOf('[');
        var hasBrackets = bracketPosition !== -1;
        return {
            hasBrackets: hasBrackets,
            name: hasBrackets ? name.slice(0, bracketPosition) : name
        };
    };

    /**
     * Parse a querystring and return an object of parameters
     */
    var parse = function parse(path, opts) {
        var options = makeOptions(opts);
        return getSearch(path).split('&').reduce(function (params, param) {
            var _a = param.split('='),
                rawName = _a[0],
                value = _a[1];
            var _b = parseName(rawName),
                hasBrackets = _b.hasBrackets,
                name = _b.name;
            var currentValue = params[name];
            var decodedValue = decode(value, options);
            if (currentValue === undefined) {
                params[name] = hasBrackets ? [decodedValue] : decodedValue;
            } else {
                params[name] = [].concat(currentValue, decodedValue);
            }
            return params;
        }, {});
    };
    /**
     * Build a querystring from an object of parameters
     */
    var build = function build(params, opts) {
        var options = makeOptions(opts);
        return Object.keys(params).filter(function (paramName) {
            return isSerialisable(params[paramName]);
        }).map(function (paramName) {
            return encode(paramName, params[paramName], options);
        }).filter(Boolean).join('&');
    };
    /**
     * Remove a list of parameters from a querystring
     */
    var omit = function omit(path, paramsToOmit, opts) {
        var options = makeOptions(opts);
        var searchPart = getSearch(path);
        if (searchPart === '') {
            return {
                querystring: '',
                removedParams: {}
            };
        }
        var _a = path.split('&').reduce(function (_a, chunk) {
            var left = _a[0],
                right = _a[1];
            var rawName = chunk.split('=')[0];
            var name = parseName(rawName).name;
            return paramsToOmit.indexOf(name) === -1 ? [left.concat(chunk), right] : [left, right.concat(chunk)];
        }, [[], []]),
            kept = _a[0],
            removed = _a[1];
        return {
            querystring: kept.join('&'),
            removedParams: parse(removed.join('&'), options)
        };
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };

    var defaultOrConstrained = function defaultOrConstrained(match) {
        return '(' + (match ? match.replace(/(^<|>$)/g, '') : "[a-zA-Z0-9-_.~%':|]+") + ')';
    };
    var rules = [{
        name: 'url-parameter',
        pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
        regex: function regex(match) {
            return new RegExp(defaultOrConstrained(match[2]));
        }
    }, {
        name: 'url-parameter-splat',
        pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
        regex: /([^?]*)/
    }, {
        name: 'url-parameter-matrix',
        pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
        regex: function regex(match) {
            return new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]));
        }
    }, {
        name: 'query-parameter',
        pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
    }, {
        name: 'delimiter',
        pattern: /^(\/|\?)/,
        regex: function regex(match) {
            return new RegExp('\\' + match[0]);
        }
    }, {
        name: 'sub-delimiter',
        pattern: /^(!|&|-|_|\.|;)/,
        regex: function regex(match) {
            return new RegExp(match[0]);
        }
    }, {
        name: 'fragment',
        pattern: /^([0-9a-zA-Z]+)/,
        regex: function regex(match) {
            return new RegExp(match[0]);
        }
    }];

    var tokenise = function tokenise(str, tokens) {
        if (tokens === void 0) {
            tokens = [];
        }
        // Look for a matching rule
        var matched = rules.some(function (rule) {
            var match = str.match(rule.pattern);
            if (!match) {
                return false;
            }
            tokens.push({
                type: rule.name,
                match: match[0],
                val: match.slice(1, 2),
                otherVal: match.slice(2),
                regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
            });
            if (match[0].length < str.length) {
                tokens = tokenise(str.substr(match[0].length), tokens);
            }
            return true;
        });
        // If no rules matched, throw an error (possible malformed path)
        if (!matched) {
            throw new Error("Could not parse path '" + str + "'");
        }
        return tokens;
    };

    var identity = function identity(_) {
        return _;
    };
    var exists = function exists(val) {
        return val !== undefined && val !== null;
    };
    var optTrailingSlash = function optTrailingSlash(source, strictTrailingSlash) {
        if (strictTrailingSlash) {
            return source;
        }
        if (source === '\\/') {
            return source;
        }
        return source.replace(/\\\/$/, '') + '(?:\\/)?';
    };
    var upToDelimiter = function upToDelimiter(source, delimiter) {
        if (!delimiter) {
            return source;
        }
        return (/(\/)$/.test(source) ? source : source + '(\\/|\\?|\\.|;|$)'
        );
    };
    var appendQueryParam = function appendQueryParam(params, param, val) {
        if (val === void 0) {
            val = '';
        }
        var existingVal = params[param];
        if (existingVal === undefined) {
            params[param] = val;
        } else {
            params[param] = Array.isArray(existingVal) ? existingVal.concat(val) : [existingVal, val];
        }
        return params;
    };
    var Path = /** @class */function () {
        function Path(path) {
            if (!path) {
                throw new Error('Missing path in Path constructor');
            }
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
            this.spatParams = this.getParams('url-parameter-splat');
            this.urlParams = this.getParams(/^url-parameter/);
            // Query params
            this.queryParams = this.getParams('query-parameter');
            // All params
            this.params = this.urlParams.concat(this.queryParams);
            // Check if hasQueryParams
            // Regular expressions for url part only (full and partial match)
            this.source = this.tokens.filter(function (t) {
                return t.regex !== undefined;
            }).map(function (r) {
                return r.regex.source;
            }).join('');
        }
        Path.createPath = function (path) {
            return new Path(path);
        };
        Path.prototype.isQueryParam = function (name) {
            return this.queryParams.indexOf(name) !== -1;
        };
        Path.prototype.test = function (path, opts) {
            var _this = this;
            var options = __assign({ strictTrailingSlash: false, queryParams: {} }, opts);
            // trailingSlash: falsy => non optional, truthy => optional
            var source = optTrailingSlash(this.source, options.strictTrailingSlash);
            // Check if exact match
            var match = this.urlTest(path, source + (this.hasQueryParams ? '(\\?.*$|$)' : '$'), opts);
            // If no match, or no query params, no need to go further
            if (!match || !this.hasQueryParams) {
                return match;
            }
            // Extract query params
            var queryParams = parse(path, options.queryParams);
            var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) {
                return !_this.isQueryParam(p);
            });
            if (unexpectedQueryParams.length === 0) {
                // Extend url match
                Object.keys(queryParams).forEach(function (p) {
                    return match[p] = queryParams[p];
                });
                return match;
            }
            return null;
        };
        Path.prototype.partialTest = function (path, opts) {
            var _this = this;
            var options = __assign({ delimited: true, queryParams: {} }, opts);
            // Check if partial match (start of given path matches regex)
            // trailingSlash: falsy => non optional, truthy => optional
            var source = upToDelimiter(this.source, options.delimited);
            var match = this.urlTest(path, source, options);
            if (!match) {
                return match;
            }
            if (!this.hasQueryParams) {
                return match;
            }
            var queryParams = parse(path, options.queryParams);
            Object.keys(queryParams).filter(function (p) {
                return _this.isQueryParam(p);
            }).forEach(function (p) {
                return appendQueryParam(match, p, queryParams[p]);
            });
            return match;
        };
        Path.prototype.build = function (params, opts) {
            var _this = this;
            if (params === void 0) {
                params = {};
            }
            var options = __assign({ ignoreConstraints: false, ignoreSearch: false, queryParams: {} }, opts);
            var encodedUrlParams = Object.keys(params).filter(function (p) {
                return !_this.isQueryParam(p);
            }).reduce(function (acc, key) {
                if (!exists(params[key])) {
                    return acc;
                }
                var val = params[key];
                var encode = _this.isQueryParam(key) ? identity : encodeURI;
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
                return !exists(params[p]);
            })) {
                var missingParameters = this.urlParams.filter(function (p) {
                    return !exists(params[p]);
                });
                throw new Error("Cannot build path: '" + this.path + "' requires missing parameters { " + missingParameters.join(', ') + ' }');
            }
            // Check constraints
            if (!options.ignoreConstraints) {
                var constraintsPassed = this.tokens.filter(function (t) {
                    return (/^url-parameter/.test(t.type) && !/-splat$/.test(t.type)
                    );
                }).every(function (t) {
                    return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedUrlParams[t.val]);
                });
                if (!constraintsPassed) {
                    throw new Error("Some parameters of '" + this.path + "' are of invalid format");
                }
            }
            var base = this.tokens.filter(function (t) {
                return (/^query-parameter/.test(t.type) === false
                );
            }).map(function (t) {
                if (t.type === 'url-parameter-matrix') {
                    return ";" + t.val + "=" + encodedUrlParams[t.val[0]];
                }
                return (/^url-parameter/.test(t.type) ? encodedUrlParams[t.val[0]] : t.match
                );
            }).join('');
            if (options.ignoreSearch) {
                return base;
            }
            var searchParams = this.queryParams.filter(function (p) {
                return Object.keys(params).indexOf(p) !== -1;
            }).reduce(function (sparams, paramName) {
                sparams[paramName] = params[paramName];
                return sparams;
            }, {});
            var searchPart = build(searchParams, options.queryParams);
            return searchPart ? base + '?' + searchPart : base;
        };
        Path.prototype.getParams = function (type) {
            var predicate = type instanceof RegExp ? function (t) {
                return type.test(t.type);
            } : function (t) {
                return t.type === type;
            };
            return this.tokens.filter(predicate).map(function (t) {
                return t.val[0];
            });
        };
        Path.prototype.urlTest = function (path, source, _a) {
            var _this = this;
            var _b = (_a === void 0 ? {} : _a).caseSensitive,
                caseSensitive = _b === void 0 ? false : _b;
            var regex = new RegExp('^' + source, caseSensitive ? '' : 'i');
            var match = path.match(regex);
            if (!match) {
                return null;
            } else if (!this.urlParams.length) {
                return {};
            }
            // Reduce named params to key-value pairs
            return match.slice(1, this.urlParams.length + 1).reduce(function (params, m, i) {
                params[_this.urlParams[i]] = decodeURIComponent(m);
                return params;
            }, {});
        };
        return Path;
    }();

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };

    var getMetaFromSegments = function getMetaFromSegments(segments) {
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
    };
    var buildStateFromMatch = function buildStateFromMatch(match) {
        if (!match || !match.segments || !match.segments.length) {
            return null;
        }
        var name = match.segments.map(function (segment) {
            return segment.name;
        }).filter(function (name) {
            return name;
        }).join('.');
        var params = match.params;
        return {
            name: name,
            params: params,
            meta: getMetaFromSegments(match.segments)
        };
    };
    var buildPathFromSegments = function buildPathFromSegments(segments, params, options) {
        if (params === void 0) {
            params = {};
        }
        if (options === void 0) {
            options = {};
        }
        if (!segments) {
            return null;
        }
        var _a = options.queryParamsMode,
            queryParamsMode = _a === void 0 ? 'default' : _a,
            _b = options.trailingSlashMode;
        var searchParams = [];
        var nonSearchParams = [];
        for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
            var segment = segments_1[_i];
            var parser = segment.parser;
            searchParams.push.apply(searchParams, parser.queryParams);
            nonSearchParams.push.apply(nonSearchParams, parser.urlParams);
            nonSearchParams.push.apply(nonSearchParams, parser.spatParams);
        }
        if (queryParamsMode === 'loose') {
            var extraParams = Object.keys(params).reduce(function (acc, p) {
                return searchParams.indexOf(p) === -1 && nonSearchParams.indexOf(p) === -1 ? acc.concat(p) : acc;
            }, []);
            searchParams.push.apply(searchParams, extraParams);
        }
        var searchParamsObject = searchParams.reduce(function (acc, paramName) {
            if (Object.keys(params).indexOf(paramName) !== -1) {
                acc[paramName] = params[paramName];
            }
            return acc;
        }, {});
        var searchPart = build(searchParamsObject);
        var path = segments.reduce(function (path, segment) {
            var segmentPath = segment.parser.build(params, {
                ignoreSearch: true,
                queryParams: options.queryParams
            });
            return segment.absolute ? segmentPath : path + segmentPath;
        }, '').replace(/\/\/{1,}/g, '/');
        var finalPath = path;
        if (options.trailingSlashMode === 'always') {
            finalPath = /\/$/.test(path) ? path : path + "/";
        } else if (options.trailingSlashMode === 'never' && path !== '/') {
            finalPath = /\/$/.test(path) ? path.slice(0, -1) : path;
        }
        return finalPath + (searchPart ? '?' + searchPart : '');
    };
    var getPathFromSegments = function getPathFromSegments(segments) {
        return segments ? segments.map(function (segment) {
            return segment.path;
        }).join('') : null;
    };

    var getPath = function getPath(path) {
        return path.split('?')[0];
    };
    var getSearch$1 = function getSearch(path) {
        return path.split('?')[1] || '';
    };
    var matchChildren = function matchChildren(nodes, pathSegment, currentMatch, options, consumedBefore) {
        if (options === void 0) {
            options = {};
        }
        var _a = options.queryParamsMode,
            queryParamsMode = _a === void 0 ? 'default' : _a,
            _b = options.strictTrailingSlash,
            strictTrailingSlash = _b === void 0 ? false : _b,
            _c = options.strongMatching,
            strongMatching = _c === void 0 ? true : _c,
            _d = options.caseSensitive,
            caseSensitive = _d === void 0 ? false : _d;
        var isRoot = nodes.length === 1 && nodes[0].name === '';
        var _loop_1 = function _loop_1(child) {
            // Partially match path
            var match;
            var remainingPath = void 0;
            var segment = pathSegment;
            if (consumedBefore === '/' && child.path === '/') {
                // when we encounter repeating slashes we add the slash
                // back to the URL to make it de facto pathless
                segment = '/' + pathSegment;
            }
            if (!child.children.length) {
                match = child.parser.test(segment, {
                    caseSensitive: caseSensitive,
                    strictTrailingSlash: strictTrailingSlash
                });
            }
            if (!match) {
                match = child.parser.partialTest(segment, {
                    delimited: strongMatching,
                    caseSensitive: caseSensitive
                });
            }
            if (match) {
                // Remove consumed segment from path
                var consumedPath = child.parser.build(match, {
                    ignoreSearch: true
                });
                if (!strictTrailingSlash && !child.children.length) {
                    consumedPath = consumedPath.replace(/\/$/, '');
                }
                remainingPath = segment.replace(new RegExp('^' + consumedPath, 'i'), '');
                if (!strictTrailingSlash && !child.children.length) {
                    remainingPath = remainingPath.replace(/^\/\?/, '?');
                }
                var querystring = omit(getSearch$1(segment.replace(consumedPath, '')), child.parser.queryParams).querystring;
                remainingPath = getPath(remainingPath) + (querystring ? "?" + querystring : '');
                if (!strictTrailingSlash && !isRoot && remainingPath === '/' && !/\/$/.test(consumedPath)) {
                    remainingPath = '';
                }
                currentMatch.segments.push(child);
                Object.keys(match).forEach(function (param) {
                    return currentMatch.params[param] = match[param];
                });
                if (!isRoot && !remainingPath.length) {
                    return { value: currentMatch };
                }
                if (!isRoot && queryParamsMode !== 'strict' && remainingPath.indexOf('?') === 0) {
                    // unmatched queryParams in non strict mode
                    var remainingQueryParams_1 = parse(remainingPath.slice(1));
                    Object.keys(remainingQueryParams_1).forEach(function (name) {
                        return currentMatch.params[name] = remainingQueryParams_1[name];
                    });
                    return { value: currentMatch };
                }
                // Continue matching on non absolute children
                var children = child.getNonAbsoluteChildren();
                // If no children to match against but unmatched path left
                if (!children.length) {
                    return { value: null };
                }
                return { value: matchChildren(children, remainingPath, currentMatch, options, consumedPath) };
            }
        };
        // for (child of node.children) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var child = nodes_1[_i];
            var state_1 = _loop_1(child);
            if ((typeof state_1 === 'undefined' ? 'undefined' : _typeof(state_1)) === "object") return state_1.value;
        }
        return null;
    };

    var sortChildren = function sortChildren(originalChildren) {
        return function (left, right) {
            var leftPath = left.path.replace(/<.*?>/g, '').split('?')[0].replace(/(.+)\/$/, '$1');
            var rightPath = right.path.replace(/<.*?>/g, '').split('?')[0].replace(/(.+)\/$/, '$1');
            // '/' last
            if (leftPath === '/') {
                return 1;
            }
            if (rightPath === '/') {
                return -1;
            }
            // Spat params last
            if (left.parser.hasSpatParam) {
                return 1;
            }
            if (right.parser.hasSpatParam) {
                return -1;
            }
            // No spat, number of segments (less segments last)
            var leftSegments = (leftPath.match(/\//g) || []).length;
            var rightSegments = (rightPath.match(/\//g) || []).length;
            if (leftSegments < rightSegments) {
                return 1;
            }
            if (leftSegments > rightSegments) {
                return -1;
            }
            // Same number of segments, number of URL params ascending
            var leftParamsCount = left.parser.urlParams.length;
            var rightParamsCount = right.parser.urlParams.length;
            if (leftParamsCount < rightParamsCount) {
                return -1;
            }
            if (leftParamsCount > rightParamsCount) {
                return 1;
            }
            // Same number of segments and params, last segment length descending
            var leftParamLength = (leftPath.split('/').slice(-1)[0] || '').length;
            var rightParamLength = (rightPath.split('/').slice(-1)[0] || '').length;
            if (leftParamLength < rightParamLength) {
                return 1;
            }
            if (leftParamLength > rightParamLength) {
                return -1;
            }
            // Same last segment length, preserve definition order. Note that we
            // cannot just return 0, as sort is not guaranteed to be a stable sort.
            return originalChildren.indexOf(left) - originalChildren.indexOf(right);
        };
    };

    var defaultBuildOptions = {
        queryParamsMode: 'default',
        trailingSlashMode: 'default'
    };
    var defaultMatchOptions = __assign$1({}, defaultBuildOptions, { strongMatching: true });
    var RouteNode = /** @class */function () {
        function RouteNode(name, path, childRoutes, cb, parent) {
            if (name === void 0) {
                name = '';
            }
            if (path === void 0) {
                path = '';
            }
            if (childRoutes === void 0) {
                childRoutes = [];
            }
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
        RouteNode.prototype.getParentSegments = function (segments) {
            if (segments === void 0) {
                segments = [];
            }
            return this.parent && this.parent.parser ? this.parent.getParentSegments(segments.concat(this.parent)) : segments.reverse();
        };
        RouteNode.prototype.setParent = function (parent) {
            this.parent = parent;
            this.checkParents();
        };
        RouteNode.prototype.setPath = function (path) {
            if (path === void 0) {
                path = '';
            }
            this.path = path;
            this.parser = path ? new Path(path) : null;
        };
        RouteNode.prototype.add = function (route, cb) {
            var _this = this;
            if (route === undefined || route === null) {
                return;
            }
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
                this.addRouteNode(route);
            } else {
                if (!route.name || !route.path) {
                    throw new Error('RouteNode.add() expects routes to have a name and a path defined.');
                }
                var routeNode = new RouteNode(route.name, route.path, route.children, cb, this);
                var fullName = routeNode.getParentSegments([routeNode]).map(function (_) {
                    return _.name;
                }).join('.');
                if (cb) {
                    cb(__assign$1({}, route, { name: fullName }));
                }
                this.addRouteNode(routeNode);
            }
            return this;
        };
        RouteNode.prototype.addNode = function (name, path) {
            this.add(new RouteNode(name, path));
            return this;
        };
        RouteNode.prototype.getPath = function (routeName) {
            return getPathFromSegments(this.getSegmentsByName(routeName));
        };
        RouteNode.prototype.getNonAbsoluteChildren = function () {
            return this.children.filter(function (child) {
                return !child.absolute;
            });
        };
        RouteNode.prototype.buildPath = function (routeName, params, options) {
            if (params === void 0) {
                params = {};
            }
            if (options === void 0) {
                options = {};
            }
            var path = buildPathFromSegments(this.getSegmentsByName(routeName), params, options);
            return path;
        };
        RouteNode.prototype.buildState = function (name, params) {
            if (params === void 0) {
                params = {};
            }
            var segments = this.getSegmentsByName(name);
            if (!segments || !segments.length) {
                return null;
            }
            return {
                name: name,
                params: params,
                meta: getMetaFromSegments(segments)
            };
        };
        RouteNode.prototype.matchPath = function (path, options) {
            if (options === void 0) {
                options = {};
            }
            if (path === '' && !options.strictTrailingSlash) {
                path = '/';
            }
            var match = this.getSegmentsMatchingPath(path, options);
            if (match) {
                var matchedSegments = match.segments;
                if (matchedSegments[0].absolute) {
                    var firstSegmentParams = matchedSegments[0].getParentSegments();
                    matchedSegments.reverse();
                    matchedSegments.push.apply(matchedSegments, firstSegmentParams);
                    matchedSegments.reverse();
                }
                var lastSegment = matchedSegments[matchedSegments.length - 1];
                var lastSegmentSlashChild = lastSegment.findSlashChild();
                if (lastSegmentSlashChild) {
                    matchedSegments.push(lastSegmentSlashChild);
                }
            }
            return buildStateFromMatch(match);
        };
        RouteNode.prototype.addRouteNode = function (route, cb) {
            var names = route.name.split('.');
            if (names.length === 1) {
                // Check duplicated routes
                if (this.children.map(function (child) {
                    return child.name;
                }).indexOf(route.name) !== -1) {
                    throw new Error("Alias \"" + route.name + "\" is already defined in route node");
                }
                // Check duplicated paths
                if (this.children.map(function (child) {
                    return child.path;
                }).indexOf(route.path) !== -1) {
                    throw new Error("Path \"" + route.path + "\" is already defined in route node");
                }
                this.children.push(route);
                // Push greedy spats to the bottom of the pile
                var originalChildren = this.children.slice(0);
                this.children.sort(sortChildren(originalChildren));
            } else {
                // Locate parent node
                var segments = this.getSegmentsByName(names.slice(0, -1).join('.'));
                if (segments) {
                    route.name = names[names.length - 1];
                    segments[segments.length - 1].add(route);
                } else {
                    throw new Error("Could not add route named '" + route.name + "', parent is missing.");
                }
            }
            return this;
        };
        RouteNode.prototype.checkParents = function () {
            if (this.absolute && this.hasParentsParams()) {
                throw new Error('[RouteNode] A RouteNode with an abolute path cannot have parents with route parameters');
            }
        };
        RouteNode.prototype.hasParentsParams = function () {
            if (this.parent && this.parent.parser) {
                var parser = this.parent.parser;
                var hasParams = parser.hasUrlParams || parser.hasSpatParam || parser.hasMatrixParams || parser.hasQueryParams;
                return hasParams || this.parent.hasParentsParams();
            }
            return false;
        };
        RouteNode.prototype.findAbsoluteChildren = function () {
            return this.children.reduce(function (absoluteChildren, child) {
                return absoluteChildren.concat(child.absolute ? child : []).concat(child.findAbsoluteChildren());
            }, []);
        };
        RouteNode.prototype.findSlashChild = function () {
            var slashChildren = this.getNonAbsoluteChildren().filter(function (child) {
                return child.parser && /^\/(\?|$)/.test(child.parser.path);
            });
            return slashChildren[0];
        };
        RouteNode.prototype.getSegmentsByName = function (routeName) {
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
        };
        RouteNode.prototype.getSegmentsMatchingPath = function (path, options) {
            var topLevelNodes = this.parser ? [this] : this.children;
            var startingNodes = topLevelNodes.reduce(function (nodes, node) {
                return nodes.concat(node, node.findAbsoluteChildren());
            }, []);
            var currentMatch = {
                segments: [],
                params: {}
            };
            var finalMatch = matchChildren(startingNodes, path, currentMatch, options);
            if (finalMatch && finalMatch.segments.length === 1 && finalMatch.segments[0].name === '') {
                return null;
            }
            return finalMatch;
        };
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

            var _router$getOptions = router.getOptions(),
                trailingSlashMode = _router$getOptions.trailingSlashMode,
                queryParamsMode = _router$getOptions.queryParamsMode,
                queryParams = _router$getOptions.queryParams;

            var encodedParams = router.config.encoders[route] ? router.config.encoders[route](params) : params;

            return router.rootNode.buildPath(route, encodedParams, {
                trailingSlashMode: trailingSlashMode,
                queryParamsMode: queryParamsMode,
                queryParams: queryParams
            });
        }

        function forwardState(routeName, routeParams) {
            var name = router.config.forwardMap[routeName] || routeName;
            var params = _extends({}, router.config.defaultParams[routeName], router.config.defaultParams[name], routeParams);

            return {
                name: name,
                params: params
            };
        }

        function buildState(routeName, routeParams) {
            var _forwardState = forwardState(routeName, routeParams),
                name = _forwardState.name,
                params = _forwardState.params;

            return router.rootNode.buildState(name, params);
        }

        /**
         * Match a path
         * @param  {String} path     The path to match
         * @param  {String} [source] The source (optional, used internally)
         * @return {Object}          The matched state (null if unmatched)
         */
        function matchPath(path, source) {
            var options = router.getOptions();
            var match = router.rootNode.matchPath(path, options);

            if (match) {
                var name = match.name,
                    params = match.params,
                    meta = match.meta;

                var decodedParams = router.config.decoders[name] ? router.config.decoders[name](params) : params;

                var _forwardState2 = forwardState(name, decodedParams),
                    routeName = _forwardState2.name,
                    routeParams = _forwardState2.params;

                var builtPath = options.rewritePathOnMatch === false ? path : router.buildPath(routeName, routeParams);

                return router.makeState(routeName, routeParams, builtPath, {
                    params: meta,
                    source: source
                });
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

    var noop = function noop() {};

    function withRouterLifecycle(router) {
        var started = false;

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

            var options = router.getOptions();
            var lastArg = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
            var done = typeof lastArg === 'function' ? lastArg : noop;
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
                    return router.navigate(route.name, route.params, { replace: true, reload: true, redirected: true }, done);
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
                    transitionToState(router.makeNotFoundState(startPath, { replace: true }));
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
        var hasStateChanged = function hasStateChanged(toState, fromState) {
            return fromState.name !== toState.name || fromState.params !== toState.params || fromState.path !== toState.path;
        };

        var mergeStates = function mergeStates(toState, fromState) {
            return _extends({}, fromState, toState, {
                meta: _extends({}, fromState.meta, toState.meta)
            });
        };

        var processFn = function processFn(stepFn, errBase, state, _done) {
            var done = function done(err, newState) {
                if (err) {
                    _done(err);
                } else if (newState && newState !== state && isState(newState)) {
                    if (hasStateChanged(newState, state)) {
                        console.error('[router5][transition] Warning: state values (name, params, path) were changed during transition process.');
                    }

                    _done(null, mergeStates(newState, state));
                } else {
                    _done(null, state);
                }
            };
            var res = stepFn.call(null, state, fromState, done);
            if (isCancelled()) {
                done(null);
            } else if (typeof res === 'boolean') {
                done(res ? null : errBase);
            } else if (isState(res)) {
                done(null, res);
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
        };

        var next = function next(err, state) {
            if (isCancelled()) {
                callback();
            } else if (err) {
                callback(err);
            } else {
                if (!remainingFunctions.length) {
                    callback(null, state);
                } else {
                    var isMapped = typeof remainingFunctions[0] === 'string';
                    var errBase = errorKey && isMapped ? defineProperty({}, errorKey, remainingFunctions[0]) : {};
                    var stepFn = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];

                    remainingFunctions = remainingFunctions.slice(1);

                    processFn(stepFn, errBase, state, next);
                }
            }
        };

        next(null, toState);
    }

    function transition(router, toState, fromState, opts, callback) {
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

    var noop$1 = function noop() {};

    function withNavigation(router) {
        var cancelCurrentTransition = void 0;

        router.config.forwardMap = {};
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
            router.config.forwardMap[fromRoute] = toRoute;

            return router;
        }

        /**
         * Navigate to a route
         * @param  {String}   routeName      The route name
         * @param  {Object}   [routeParams]  The route params
         * @param  {Object}   [options]      The navigation options (`replace`, `reload`, `skipTransition`, `force`)
         * @param  {Function} [done]         A done node style callback (err, state)
         * @return {Function}                A cancel function
         */
        function navigate() {
            var _ref;

            var name = arguments.length <= 0 ? undefined : arguments[0];
            var lastArg = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
            var done = typeof lastArg === 'function' ? lastArg : noop$1;
            var params = _typeof(arguments.length <= 1 ? undefined : arguments[1]) === 'object' ? arguments.length <= 1 ? undefined : arguments[1] : {};
            var opts = _typeof(arguments.length <= 2 ? undefined : arguments[2]) === 'object' ? arguments.length <= 2 ? undefined : arguments[2] : {};

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

            var toState = router.makeState(route.name, route.params, router.buildPath(route.name, route.params), { params: route.meta, options: opts });
            var sameStates = router.getState() ? router.areStatesEqual(router.getState(), toState, false) : false;

            // Do not proceed further if states are the same and no reload
            // (no deactivation and no callbacks)
            if (sameStates && !opts.reload && !opts.force) {
                var _err = { code: errorCodes.SAME_STATES };
                done(_err);
                router.invokeEventListeners(constants.TRANSITION_ERROR, toState, router.getState(), _err);
                return;
            }

            var fromState = sameStates || opts.reload ? null : router.getState();

            if (opts.skipTransition) {
                done(null, toState);
                return noop$1;
            }

            // Transition
            return transitionToState(toState, fromState, opts, function (err, state) {
                if (err) {
                    if (err.redirect) {
                        var _err$redirect = err.redirect,
                            _name = _err$redirect.name,
                            _params = _err$redirect.params;


                        navigate(_name, _params, _extends({}, opts, { force: true, redirected: true }), done);
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
            var done = arguments.length === 2 ? arguments.length <= 1 ? undefined : arguments[1] : typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function' ? arguments.length <= 0 ? undefined : arguments[0] : noop$1;
            var options = router.getOptions();

            if (options.defaultRoute) {
                return navigate(options.defaultRoute, options.defaultParams, opts, done);
            }

            return function () {};
        }

        function transitionToState(toState, fromState) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop$1;

            cancel();
            router.invokeEventListeners(constants.TRANSITION_START, toState, fromState);

            cancelCurrentTransition = transition(router, toState, fromState, options, function (err, state) {
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

    function symbolObservablePonyfill(root) {
    	var result;
    	var _Symbol = root.Symbol;

    	if (typeof _Symbol === 'function') {
    		if (_Symbol.observable) {
    			result = _Symbol.observable;
    		} else {
    			result = _Symbol('observable');
    			_Symbol.observable = result;
    		}
    	} else {
    		result = '@@observable';
    	}

    	return result;
    }

    /* global window */

    var root;

    if (typeof self !== 'undefined') {
      root = self;
    } else if (typeof window !== 'undefined') {
      root = window;
    } else if (typeof global !== 'undefined') {
      root = global;
    } else if (typeof module !== 'undefined') {
      root = module;
    } else {
      root = Function('return this')();
    }

    var result = symbolObservablePonyfill(root);

    function observerPlugin(router) {
        var listeners = [];

        function unsubscribe(listener) {
            if (listener) {
                listeners = listeners.filter(function (l) {
                    return l !== listener;
                });
            }
        }

        function _subscribe(listener) {
            listeners = listeners.concat(listener);

            return function () {
                return unsubscribe(listener);
            };
        }

        function observable() {
            return defineProperty({
                subscribe: function subscribe(observer) {
                    if ((typeof observer === 'undefined' ? 'undefined' : _typeof(observer)) !== 'object' || observer === null) {
                        throw new TypeError('Expected the observer to be an object.');
                    }

                    function listener() {
                        if (observer.next) {
                            observer.next(router.getState());
                        }
                    }

                    listener();
                    var unsubscribe = _subscribe(listener);
                    return { unsubscribe: unsubscribe };
                }
            }, result, function () {
                return this;
            });
        }

        router.subscribe = _subscribe;
        router[result] = observable;

        return {
            onTransitionSuccess: function onTransitionSuccess(toState, fromState) {
                listeners.forEach(function (listener) {
                    return listener({
                        route: toState,
                        previousRoute: fromState
                    });
                });
            }
        };
    }

    observerPlugin.pluginName = 'OBSERVABLE_PLUGIN';

    function withObservablePlugin(router) {
        router.usePlugin(observerPlugin);
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
            clonedRouter.config = router.config;

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
        trailingSlashMode: 'default',
        queryParamsMode: 'default',
        strictTrailingSlash: false,
        autoCleanUp: true,
        allowNotFound: false,
        strongMatching: true,
        rewritePathOnMatch: true,
        caseSensitive: false

        /**
         * Create a router
         * @param  {Array}  [routes]          The routes
         * @param  {Object} [options={}]      The router options
         * @param  {Object} [dependencies={}] The router dependencies
         * @return {Object}                   The router instance
         */
    };function createRouter(routes) {
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
            config: {
                decoders: {},
                encoders: {},
                defaultParams: {}
            },
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
        };function invokeEventListeners(eventName) {
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
        withObservablePlugin(router);
        withRouteLifecycle(router);
        withRouterLifecycle(router);
        withNavigation(router);
        withCloning(router, createRouter);

        var rootNode = routes instanceof RouteNode ? routes : new RouteNode('', '', routes, onRouteAdded);

        router.rootNode = rootNode;

        return router;

        function onRouteAdded(route) {
            if (route.canActivate) router.canActivate(route.name, route.canActivate);

            if (route.forwardTo) router.forward(route.name, route.forwardTo);

            if (route.decodeParams) router.config.decoders[route.name] = route.decodeParams;

            if (route.encodeParams) router.config.encoders[route.name] = route.encodeParams;

            if (route.defaultParams) router.config.defaultParams[route.name] = route.defaultParams;
        }

        /**
         * Build a state object
         * @param  {String} name         The state name
         * @param  {Object} params       The state params
         * @param  {String} path         The state path
         * @param  {Object} [meta]       The meta object
         * @param  {Number} [forceId]    The ID to use in meta (incremented by default)
         * @return {Object}              The state object
         */
        function makeState(name, params, path, meta, forceId) {
            var state = {};
            var setProp = function setProp(key, value) {
                return Object.defineProperty(state, key, { value: value, enumerable: true });
            };
            setProp('name', name);
            setProp('params', params);
            setProp('path', path);

            if (meta) {
                var finalStateId = void 0;

                if (forceId === undefined) {
                    stateId += 1;
                    finalStateId = stateId;
                } else {
                    finalStateId = forceId;
                }

                setProp('meta', _extends({}, meta, { id: finalStateId }));
            }

            return state;
        }

        /**
         * Build a not found state for a given path
         * @param  {String} path      The unmatched path
         * @param  {Object} [options] The navigation options
         * @return {Object}           The not found state object
         */
        function makeNotFoundState(path, options) {
            return makeState(constants.UNKNOWN_ROUTE, { path: path }, path, { options: options });
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

            if (state && state.meta && typeof state.meta.id === 'number') {
                stateId = state.meta.id;
            }
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
    var noop$2 = function noop() {};

    function loggerPlugin() {
        var startGroup = void 0,
            endGroup = void 0;

        if (console.groupCollapsed) {
            startGroup = function startGroup(label) {
                return console.groupCollapsed(label);
            };
            endGroup = function endGroup() {
                return console.groupEnd();
            };
        } else if (console.group) {
            startGroup = function startGroup(label) {
                return console.group(label);
            };
            endGroup = function endGroup() {
                return console.groupEnd();
            };
        } else {
            startGroup = noop$2;
            endGroup = noop$2;
        }

        console.info('Router started');

        return {
            onStop: function onStop() {
                console.info('Router stopped');
            },
            onTransitionStart: function onTransitionStart(toState, fromState) {
                endGroup();
                startGroup('Router transition');
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

    exports.default = createRouter;
    exports.createRouter = createRouter;
    exports.RouteNode = RouteNode;
    exports.loggerPlugin = loggerPlugin;
    exports.errorCodes = errorCodes;
    exports.transitionPath = transitionPath;
    exports.constants = constants;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
