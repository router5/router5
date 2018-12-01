(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.router5 = {})));
}(this, (function (exports) { 'use strict';

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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var defaultOptions = {
        trailingSlashMode: 'default',
        queryParamsMode: 'default',
        strictTrailingSlash: false,
        autoCleanUp: true,
        allowNotFound: false,
        strongMatching: true,
        rewritePathOnMatch: true,
        caseSensitive: false
    };
    function withOptions(options) {
        return function (router) {
            var routerOptions = __assign({}, defaultOptions, options);
            router.getOptions = function () { return routerOptions; };
            router.setOption = function (option, value) {
                routerOptions[option] = value;
                return router;
            };
            return router;
        };
    }

    var makeOptions = function (opts) {
        if (opts === void 0) { opts = {}; }
        return ({
            arrayFormat: opts.arrayFormat || 'none',
            booleanFormat: opts.booleanFormat || 'none',
            nullFormat: opts.nullFormat || 'default'
        });
    };
    var encodeValue = function (value) { return encodeURIComponent(value); };
    var decodeValue = function (value) { return decodeURIComponent(value); };
    var encodeBoolean = function (name, value, opts) {
        if (opts.booleanFormat === 'empty-true' && value) {
            return name;
        }
        var encodedValue;
        if (opts.booleanFormat === 'unicode') {
            encodedValue = value ? '✓' : '✗';
        }
        else {
            encodedValue = value.toString();
        }
        return name + "=" + encodedValue;
    };
    var encodeNull = function (name, opts) {
        if (opts.nullFormat === 'hidden') {
            return '';
        }
        if (opts.nullFormat === 'string') {
            return name + "=null";
        }
        return name;
    };
    var getNameEncoder = function (opts) {
        if (opts.arrayFormat === 'index') {
            return function (name, index) { return name + "[" + index + "]"; };
        }
        if (opts.arrayFormat === 'brackets') {
            return function (name) { return name + "[]"; };
        }
        return function (name) { return name; };
    };
    var encodeArray = function (name, arr, opts) {
        var encodeName = getNameEncoder(opts);
        return arr
            .map(function (val, index) { return encodeName(name, index) + "=" + encodeValue(val); })
            .join('&');
    };
    var encode = function (name, value, opts) {
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
    var decode = function (value, opts) {
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
        }
        else if (opts.booleanFormat === 'unicode') {
            if (decodeValue(value) === '✓') {
                return true;
            }
            if (decodeValue(value) === '✗') {
                return false;
            }
        }
        else if (opts.nullFormat === 'string') {
            if (value === 'null') {
                return null;
            }
        }
        return decodeValue(value);
    };

    var getSearch = function (path) {
        var pos = path.indexOf('?');
        if (pos === -1) {
            return path;
        }
        return path.slice(pos + 1);
    };
    var isSerialisable = function (val) { return val !== undefined; };
    var parseName = function (name) {
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
    var parse = function (path, opts) {
        var options = makeOptions(opts);
        return getSearch(path)
            .split('&')
            .reduce(function (params, param) {
            var _a = param.split('='), rawName = _a[0], value = _a[1];
            var _b = parseName(rawName), hasBrackets = _b.hasBrackets, name = _b.name;
            var currentValue = params[name];
            var decodedValue = decode(value, options);
            if (currentValue === undefined) {
                params[name] = hasBrackets ? [decodedValue] : decodedValue;
            }
            else {
                params[name] = [].concat(currentValue, decodedValue);
            }
            return params;
        }, {});
    };
    /**
     * Build a querystring from an object of parameters
     */
    var build = function (params, opts) {
        var options = makeOptions(opts);
        return Object.keys(params)
            .filter(function (paramName) { return isSerialisable(params[paramName]); })
            .map(function (paramName) { return encode(paramName, params[paramName], options); })
            .filter(Boolean)
            .join('&');
    };
    /**
     * Remove a list of parameters from a querystring
     */
    var omit = function (path, paramsToOmit, opts) {
        var options = makeOptions(opts);
        var searchPart = getSearch(path);
        if (searchPart === '') {
            return {
                querystring: '',
                removedParams: {}
            };
        }
        var _a = path.split('&').reduce(function (_a, chunk) {
            var left = _a[0], right = _a[1];
            var rawName = chunk.split('=')[0];
            var name = parseName(rawName).name;
            return paramsToOmit.indexOf(name) === -1
                ? [left.concat(chunk), right]
                : [left, right.concat(chunk)];
        }, [[], []]), kept = _a[0], removed = _a[1];
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

    var __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    var defaultOrConstrained = function (match) {
        return '(' +
            (match ? match.replace(/(^<|>$)/g, '') : "[a-zA-Z0-9-_.~%':|=+\\*@]+") +
            ')';
    };
    var rules = [
        {
            name: 'url-parameter',
            pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
            regex: function (match) {
                return new RegExp(defaultOrConstrained(match[2]));
            }
        },
        {
            name: 'url-parameter-splat',
            pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
            regex: /([^?]*)/
        },
        {
            name: 'url-parameter-matrix',
            pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
            regex: function (match) {
                return new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]));
            }
        },
        {
            name: 'query-parameter',
            pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
        },
        {
            name: 'delimiter',
            pattern: /^(\/|\?)/,
            regex: function (match) { return new RegExp('\\' + match[0]); }
        },
        {
            name: 'sub-delimiter',
            pattern: /^(!|&|-|_|\.|;)/,
            regex: function (match) { return new RegExp(match[0]); }
        },
        {
            name: 'fragment',
            pattern: /^([0-9a-zA-Z]+)/,
            regex: function (match) { return new RegExp(match[0]); }
        }
    ];

    var tokenise = function (str, tokens) {
        if (tokens === void 0) { tokens = []; }
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

    var identity = function (_) { return _; };
    var exists = function (val) { return val !== undefined && val !== null; };
    var optTrailingSlash = function (source, strictTrailingSlash) {
        if (strictTrailingSlash) {
            return source;
        }
        if (source === '\\/') {
            return source;
        }
        return source.replace(/\\\/$/, '') + '(?:\\/)?';
    };
    var upToDelimiter = function (source, delimiter) {
        if (!delimiter) {
            return source;
        }
        return /(\/)$/.test(source) ? source : source + '(\\/|\\?|\\.|;|$)';
    };
    var appendQueryParam = function (params, param, val) {
        if (val === void 0) { val = ''; }
        var existingVal = params[param];
        if (existingVal === undefined) {
            params[param] = val;
        }
        else {
            params[param] = Array.isArray(existingVal)
                ? existingVal.concat(val)
                : [existingVal, val];
        }
        return params;
    };
    var Path = /** @class */ (function () {
        function Path(path) {
            if (!path) {
                throw new Error('Missing path in Path constructor');
            }
            this.path = path;
            this.tokens = tokenise(path);
            this.hasUrlParams =
                this.tokens.filter(function (t) { return /^url-parameter/.test(t.type); }).length > 0;
            this.hasSpatParam =
                this.tokens.filter(function (t) { return /splat$/.test(t.type); }).length > 0;
            this.hasMatrixParams =
                this.tokens.filter(function (t) { return /matrix$/.test(t.type); }).length > 0;
            this.hasQueryParams =
                this.tokens.filter(function (t) { return /^query-parameter/.test(t.type); }).length > 0;
            // Extract named parameters from tokens
            this.spatParams = this.getParams('url-parameter-splat');
            this.urlParams = this.getParams(/^url-parameter/);
            // Query params
            this.queryParams = this.getParams('query-parameter');
            // All params
            this.params = this.urlParams.concat(this.queryParams);
            // Check if hasQueryParams
            // Regular expressions for url part only (full and partial match)
            this.source = this.tokens
                .filter(function (t) { return t.regex !== undefined; })
                .map(function (r) { return r.regex.source; })
                .join('');
        }
        Path.createPath = function (path) {
            return new Path(path);
        };
        Path.prototype.isQueryParam = function (name) {
            return this.queryParams.indexOf(name) !== -1;
        };
        Path.prototype.test = function (path, opts) {
            var _this = this;
            var options = __assign$1({ strictTrailingSlash: false, queryParams: {} }, opts);
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
            var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) { return !_this.isQueryParam(p); });
            if (unexpectedQueryParams.length === 0) {
                // Extend url match
                Object.keys(queryParams).forEach(function (p) { return (match[p] = queryParams[p]); });
                return match;
            }
            return null;
        };
        Path.prototype.partialTest = function (path, opts) {
            var _this = this;
            var options = __assign$1({ delimited: true, queryParams: {} }, opts);
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
            Object.keys(queryParams)
                .filter(function (p) { return _this.isQueryParam(p); })
                .forEach(function (p) { return appendQueryParam(match, p, queryParams[p]); });
            return match;
        };
        Path.prototype.build = function (params, opts) {
            var _this = this;
            if (params === void 0) { params = {}; }
            var options = __assign$1({ ignoreConstraints: false, ignoreSearch: false, queryParams: {} }, opts);
            var encodedUrlParams = Object.keys(params)
                .filter(function (p) { return !_this.isQueryParam(p); })
                .reduce(function (acc, key) {
                if (!exists(params[key])) {
                    return acc;
                }
                var val = params[key];
                var encode = _this.isQueryParam(key) ? identity : encodeURI;
                if (typeof val === 'boolean') {
                    acc[key] = val;
                }
                else if (Array.isArray(val)) {
                    acc[key] = val.map(encode);
                }
                else {
                    acc[key] = encode(val);
                }
                return acc;
            }, {});
            // Check all params are provided (not search parameters which are optional)
            if (this.urlParams.some(function (p) { return !exists(params[p]); })) {
                var missingParameters = this.urlParams.filter(function (p) { return !exists(params[p]); });
                throw new Error("Cannot build path: '" +
                    this.path +
                    "' requires missing parameters { " +
                    missingParameters.join(', ') +
                    ' }');
            }
            // Check constraints
            if (!options.ignoreConstraints) {
                var constraintsPassed = this.tokens
                    .filter(function (t) {
                    return /^url-parameter/.test(t.type) && !/-splat$/.test(t.type);
                })
                    .every(function (t) {
                    return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedUrlParams[t.val]);
                });
                if (!constraintsPassed) {
                    throw new Error("Some parameters of '" + this.path + "' are of invalid format");
                }
            }
            var base = this.tokens
                .filter(function (t) { return /^query-parameter/.test(t.type) === false; })
                .map(function (t) {
                if (t.type === 'url-parameter-matrix') {
                    return ";" + t.val + "=" + encodedUrlParams[t.val[0]];
                }
                return /^url-parameter/.test(t.type)
                    ? encodedUrlParams[t.val[0]]
                    : t.match;
            })
                .join('');
            if (options.ignoreSearch) {
                return base;
            }
            var searchParams = this.queryParams
                .filter(function (p) { return Object.keys(params).indexOf(p) !== -1; })
                .reduce(function (sparams, paramName) {
                sparams[paramName] = params[paramName];
                return sparams;
            }, {});
            var searchPart = build(searchParams, options.queryParams);
            return searchPart ? base + '?' + searchPart : base;
        };
        Path.prototype.getParams = function (type) {
            var predicate = type instanceof RegExp
                ? function (t) { return type.test(t.type); }
                : function (t) { return t.type === type; };
            return this.tokens.filter(predicate).map(function (t) { return t.val[0]; });
        };
        Path.prototype.urlTest = function (path, source, _a) {
            var _this = this;
            var _b = (_a === void 0 ? {} : _a).caseSensitive, caseSensitive = _b === void 0 ? false : _b;
            var regex = new RegExp('^' + source, caseSensitive ? '' : 'i');
            var match = path.match(regex);
            if (!match) {
                return null;
            }
            else if (!this.urlParams.length) {
                return {};
            }
            // Reduce named params to key-value pairs
            return match
                .slice(1, this.urlParams.length + 1)
                .reduce(function (params, m, i) {
                params[_this.urlParams[i]] = decodeURIComponent(m);
                return params;
            }, {});
        };
        return Path;
    }());

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

    var __assign$2 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    var getMetaFromSegments = function (segments) {
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
    var buildStateFromMatch = function (match) {
        if (!match || !match.segments || !match.segments.length) {
            return null;
        }
        var name = match.segments
            .map(function (segment) { return segment.name; })
            .filter(function (name) { return name; })
            .join('.');
        var params = match.params;
        return {
            name: name,
            params: params,
            meta: getMetaFromSegments(match.segments)
        };
    };
    var buildPathFromSegments = function (segments, params, options) {
        if (params === void 0) { params = {}; }
        if (options === void 0) { options = {}; }
        if (!segments) {
            return null;
        }
        var _a = options.queryParamsMode, queryParamsMode = _a === void 0 ? 'default' : _a, _b = options.trailingSlashMode;
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
                return searchParams.indexOf(p) === -1 &&
                    nonSearchParams.indexOf(p) === -1
                    ? acc.concat(p)
                    : acc;
            }, []);
            searchParams.push.apply(searchParams, extraParams);
        }
        var searchParamsObject = searchParams.reduce(function (acc, paramName) {
            if (Object.keys(params).indexOf(paramName) !== -1) {
                acc[paramName] = params[paramName];
            }
            return acc;
        }, {});
        var searchPart = build(searchParamsObject, options.queryParams);
        var path = segments
            .reduce(function (path, segment) {
            var segmentPath = segment.parser.build(params, {
                ignoreSearch: true,
                queryParams: options.queryParams
            });
            return segment.absolute ? segmentPath : path + segmentPath;
        }, '')
            .replace(/\/\/{1,}/g, '/');
        var finalPath = path;
        if (options.trailingSlashMode === 'always') {
            finalPath = /\/$/.test(path) ? path : path + "/";
        }
        else if (options.trailingSlashMode === 'never' && path !== '/') {
            finalPath = /\/$/.test(path) ? path.slice(0, -1) : path;
        }
        return finalPath + (searchPart ? '?' + searchPart : '');
    };
    var getPathFromSegments = function (segments) {
        return segments ? segments.map(function (segment) { return segment.path; }).join('') : null;
    };

    var getPath = function (path) { return path.split('?')[0]; };
    var getSearch$1 = function (path) { return path.split('?')[1] || ''; };
    var matchChildren = function (nodes, pathSegment, currentMatch, options, consumedBefore) {
        if (options === void 0) { options = {}; }
        var _a = options.queryParamsMode, queryParamsMode = _a === void 0 ? 'default' : _a, _b = options.strictTrailingSlash, strictTrailingSlash = _b === void 0 ? false : _b, _c = options.strongMatching, strongMatching = _c === void 0 ? true : _c, _d = options.caseSensitive, caseSensitive = _d === void 0 ? false : _d;
        var isRoot = nodes.length === 1 && nodes[0].name === '';
        var _loop_1 = function (child) {
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
                    strictTrailingSlash: strictTrailingSlash,
                    queryParams: options.queryParams
                });
            }
            if (!match) {
                match = child.parser.partialTest(segment, {
                    delimited: strongMatching,
                    caseSensitive: caseSensitive,
                    queryParams: options.queryParams
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
                // Can't create a regexp from the path because it might contain a
                // regexp character.
                if (segment.toLowerCase().indexOf(consumedPath.toLowerCase()) === 0) {
                    remainingPath = segment.slice(consumedPath.length);
                }
                else {
                    remainingPath = segment;
                }
                if (!strictTrailingSlash && !child.children.length) {
                    remainingPath = remainingPath.replace(/^\/\?/, '?');
                }
                var querystring = omit(getSearch$1(segment.replace(consumedPath, '')), child.parser.queryParams, options.queryParams).querystring;
                remainingPath =
                    getPath(remainingPath) + (querystring ? "?" + querystring : '');
                if (!strictTrailingSlash &&
                    !isRoot &&
                    remainingPath === '/' &&
                    !/\/$/.test(consumedPath)) {
                    remainingPath = '';
                }
                currentMatch.segments.push(child);
                Object.keys(match).forEach(function (param) { return (currentMatch.params[param] = match[param]); });
                if (!isRoot && !remainingPath.length) {
                    return { value: currentMatch };
                }
                if (!isRoot &&
                    queryParamsMode !== 'strict' &&
                    remainingPath.indexOf('?') === 0) {
                    // unmatched queryParams in non strict mode
                    var remainingQueryParams_1 = parse(remainingPath.slice(1), options.queryParams);
                    Object.keys(remainingQueryParams_1).forEach(function (name) {
                        return (currentMatch.params[name] = remainingQueryParams_1[name]);
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
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return null;
    };

    function sortChildren(children) {
        var originalChildren = children.slice(0);
        return children.sort(sortPredicate(originalChildren));
    }
    var sortPredicate = function (originalChildren) { return function (left, right) {
        var leftPath = left.path
            .replace(/<.*?>/g, '')
            .split('?')[0]
            .replace(/(.+)\/$/, '$1');
        var rightPath = right.path
            .replace(/<.*?>/g, '')
            .split('?')[0]
            .replace(/(.+)\/$/, '$1');
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
    }; };

    var defaultBuildOptions = {
        queryParamsMode: 'default',
        trailingSlashMode: 'default'
    };
    var defaultMatchOptions = __assign$2({}, defaultBuildOptions, { strongMatching: true });
    var RouteNode = /** @class */ (function () {
        function RouteNode(name, path, childRoutes, cb, parent, finalSort, sort) {
            if (name === void 0) { name = ''; }
            if (path === void 0) { path = ''; }
            if (childRoutes === void 0) { childRoutes = []; }
            if (finalSort === void 0) { finalSort = true; }
            this.name = name;
            this.absolute = /^~/.test(path);
            this.path = this.absolute ? path.slice(1) : path;
            this.parser = this.path ? new Path(this.path) : null;
            this.children = [];
            this.parent = parent;
            this.checkParents();
            this.add(childRoutes, cb, finalSort ? false : sort !== false);
            if (finalSort) {
                this.sortDescendants();
            }
            return this;
        }
        RouteNode.prototype.getParentSegments = function (segments) {
            if (segments === void 0) { segments = []; }
            return this.parent && this.parent.parser
                ? this.parent.getParentSegments(segments.concat(this.parent))
                : segments.reverse();
        };
        RouteNode.prototype.setParent = function (parent) {
            this.parent = parent;
            this.checkParents();
        };
        RouteNode.prototype.setPath = function (path) {
            if (path === void 0) { path = ''; }
            this.path = path;
            this.parser = path ? new Path(path) : null;
        };
        RouteNode.prototype.add = function (route, cb, sort) {
            var _this = this;
            if (sort === void 0) { sort = true; }
            if (route === undefined || route === null) {
                return;
            }
            if (route instanceof Array) {
                route.forEach(function (r) { return _this.add(r, cb, sort); });
                return;
            }
            if (!(route instanceof RouteNode) && !(route instanceof Object)) {
                throw new Error('RouteNode.add() expects routes to be an Object or an instance of RouteNode.');
            }
            else if (route instanceof RouteNode) {
                route.setParent(this);
                this.addRouteNode(route, sort);
            }
            else {
                if (!route.name || !route.path) {
                    throw new Error('RouteNode.add() expects routes to have a name and a path defined.');
                }
                var routeNode = new RouteNode(route.name, route.path, route.children, cb, this, false, sort);
                var fullName = routeNode
                    .getParentSegments([routeNode])
                    .map(function (_) { return _.name; })
                    .join('.');
                if (cb) {
                    cb(__assign$2({}, route, { name: fullName }));
                }
                this.addRouteNode(routeNode, sort);
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
            return this.children.filter(function (child) { return !child.absolute; });
        };
        RouteNode.prototype.sortChildren = function () {
            if (this.children.length) {
                sortChildren(this.children);
            }
        };
        RouteNode.prototype.sortDescendants = function () {
            this.sortChildren();
            this.children.forEach(function (child) { return child.sortDescendants(); });
        };
        RouteNode.prototype.buildPath = function (routeName, params, options) {
            if (params === void 0) { params = {}; }
            if (options === void 0) { options = {}; }
            var path = buildPathFromSegments(this.getSegmentsByName(routeName), params, options);
            return path;
        };
        RouteNode.prototype.buildState = function (name, params) {
            if (params === void 0) { params = {}; }
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
            if (options === void 0) { options = {}; }
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
        RouteNode.prototype.addRouteNode = function (route, sort) {
            if (sort === void 0) { sort = true; }
            var names = route.name.split('.');
            if (names.length === 1) {
                // Check duplicated routes
                if (this.children.map(function (child) { return child.name; }).indexOf(route.name) !==
                    -1) {
                    throw new Error("Alias \"" + route.name + "\" is already defined in route node");
                }
                // Check duplicated paths
                if (this.children.map(function (child) { return child.path; }).indexOf(route.path) !==
                    -1) {
                    throw new Error("Path \"" + route.path + "\" is already defined in route node");
                }
                this.children.push(route);
                if (sort) {
                    this.sortChildren();
                }
            }
            else {
                // Locate parent node
                var segments = this.getSegmentsByName(names.slice(0, -1).join('.'));
                if (segments) {
                    route.name = names[names.length - 1];
                    segments[segments.length - 1].add(route);
                }
                else {
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
                var hasParams = parser.hasUrlParams ||
                    parser.hasSpatParam ||
                    parser.hasMatrixParams ||
                    parser.hasQueryParams;
                return hasParams || this.parent.hasParentsParams();
            }
            return false;
        };
        RouteNode.prototype.findAbsoluteChildren = function () {
            return this.children.reduce(function (absoluteChildren, child) {
                return absoluteChildren
                    .concat(child.absolute ? child : [])
                    .concat(child.findAbsoluteChildren());
            }, []);
        };
        RouteNode.prototype.findSlashChild = function () {
            var slashChildren = this.getNonAbsoluteChildren().filter(function (child) { return child.parser && /^\/(\?|$)/.test(child.parser.path); });
            return slashChildren[0];
        };
        RouteNode.prototype.getSegmentsByName = function (routeName) {
            var findSegmentByName = function (name, routes) {
                var filteredRoutes = routes.filter(function (r) { return r.name === name; });
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
            var startingNodes = topLevelNodes.reduce(function (nodes, node) { return nodes.concat(node, node.findAbsoluteChildren()); }, []);
            var currentMatch = {
                segments: [],
                params: {}
            };
            var finalMatch = matchChildren(startingNodes, path, currentMatch, options);
            if (finalMatch &&
                finalMatch.segments.length === 1 &&
                finalMatch.segments[0].name === '') {
                return null;
            }
            return finalMatch;
        };
        return RouteNode;
    }());

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

    function withRoutes(routes) {
        return function (router) {
            router.forward = function (fromRoute, toRoute) {
                router.config.forwardMap[fromRoute] = toRoute;
                return router;
            };
            var rootNode = routes instanceof RouteNode
                ? routes
                : new RouteNode('', '', routes, onRouteAdded);
            function onRouteAdded(route) {
                if (route.canActivate)
                    router.canActivate(route.name, route.canActivate);
                if (route.forwardTo)
                    router.forward(route.name, route.forwardTo);
                if (route.decodeParams)
                    router.config.decoders[route.name] = route.decodeParams;
                if (route.encodeParams)
                    router.config.encoders[route.name] = route.encodeParams;
                if (route.defaultParams)
                    router.config.defaultParams[route.name] = route.defaultParams;
            }
            router.rootNode = rootNode;
            router.add = function (routes, finalSort) {
                rootNode.add(routes, onRouteAdded, !finalSort);
                if (finalSort) {
                    rootNode.sortDescendants();
                }
                return router;
            };
            router.addNode = function (name, path, canActivateHandler) {
                rootNode.addNode(name, path);
                if (canActivateHandler)
                    router.canActivate(name, canActivateHandler);
                return router;
            };
            router.isActive = function (name, params, strictEquality, ignoreQueryParams) {
                if (params === void 0) { params = {}; }
                if (strictEquality === void 0) { strictEquality = false; }
                if (ignoreQueryParams === void 0) { ignoreQueryParams = true; }
                var activeState = router.getState();
                if (!activeState)
                    return false;
                if (strictEquality || activeState.name === name) {
                    return router.areStatesEqual(router.makeState(name, params), activeState, ignoreQueryParams);
                }
                return router.areStatesDescendants(router.makeState(name, params), activeState);
            };
            router.buildPath = function (route, params) {
                if (route === constants.UNKNOWN_ROUTE) {
                    return params.path;
                }
                var paramsWithDefault = __assign({}, router.config.defaultParams[route], params);
                var _a = router.getOptions(), trailingSlashMode = _a.trailingSlashMode, queryParamsMode = _a.queryParamsMode, queryParams = _a.queryParams;
                var encodedParams = router.config.encoders[route]
                    ? router.config.encoders[route](paramsWithDefault)
                    : paramsWithDefault;
                return router.rootNode.buildPath(route, encodedParams, {
                    trailingSlashMode: trailingSlashMode,
                    queryParamsMode: queryParamsMode,
                    queryParams: queryParams
                });
            };
            router.matchPath = function (path, source) {
                var options = router.getOptions();
                var match = router.rootNode.matchPath(path, options);
                if (match) {
                    var name_1 = match.name, params = match.params, meta = match.meta;
                    var decodedParams = router.config.decoders[name_1]
                        ? router.config.decoders[name_1](params)
                        : params;
                    var _a = router.forwardState(name_1, decodedParams), routeName = _a.name, routeParams = _a.params;
                    var builtPath = options.rewritePathOnMatch === false
                        ? path
                        : router.buildPath(routeName, routeParams);
                    return router.makeState(routeName, routeParams, builtPath, {
                        params: meta,
                        source: source
                    });
                }
                return null;
            };
            router.setRootPath = function (rootPath) {
                router.rootNode.setPath(rootPath);
            };
            return router;
        };
    }

    function withDependencies(dependencies) {
        return function (router) {
            var routerDependencies = dependencies;
            router.setDependency = function (dependencyName, dependency) {
                routerDependencies[dependencyName] = dependency;
                return router;
            };
            router.setDependencies = function (deps) {
                Object.keys(deps).forEach(function (name) {
                    return router.setDependency(name, deps[name]);
                });
                return router;
            };
            router.getDependencies = function () { return routerDependencies; };
            router.getInjectables = function () { return [router, router.getDependencies()]; };
            router.executeFactory = function (factoryFunction) {
                return factoryFunction.apply(void 0, router.getInjectables());
            };
            return router;
        };
    }

    function withState(router) {
        var stateId = 0;
        var routerState = null;
        router.getState = function () { return routerState; };
        router.setState = function (state) {
            routerState = state;
        };
        router.makeState = function (name, params, path, meta, forceId) { return ({
            name: name,
            params: __assign({}, router.config.defaultParams[name], params),
            path: path,
            meta: meta
                ? __assign({}, meta, { id: forceId === undefined ? ++stateId : forceId }) : undefined
        }); };
        router.makeNotFoundState = function (path, options) {
            return router.makeState(constants.UNKNOWN_ROUTE, { path: path }, path, {
                options: options
            });
        };
        router.areStatesEqual = function (state1, state2, ignoreQueryParams) {
            if (ignoreQueryParams === void 0) { ignoreQueryParams = true; }
            if (state1.name !== state2.name)
                return false;
            var getUrlParams = function (name) {
                return router.rootNode
                    //@ts-ignore
                    .getSegmentsByName(name)
                    .map(function (segment) { return segment.parser['urlParams']; })
                    .reduce(function (params, p) { return params.concat(p); }, []);
            };
            var state1Params = ignoreQueryParams
                ? getUrlParams(state1.name)
                : Object.keys(state1.params);
            var state2Params = ignoreQueryParams
                ? getUrlParams(state2.name)
                : Object.keys(state2.params);
            return (state1Params.length === state2Params.length &&
                state1Params.every(function (p) { return state1.params[p] === state2.params[p]; }));
        };
        router.areStatesDescendants = function (parentState, childState) {
            var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
            if (!regex.test(childState.name))
                return false;
            // If child state name extends parent state name, and all parent state params
            // are in child state params.
            return Object.keys(parentState.params).every(function (p) { return parentState.params[p] === childState.params[p]; });
        };
        router.forwardState = function (routeName, routeParams) {
            var name = router.config.forwardMap[routeName] || routeName;
            var params = __assign({}, router.config.defaultParams[routeName], router.config.defaultParams[name], routeParams);
            return {
                name: name,
                params: params
            };
        };
        router.buildState = function (routeName, routeParams) {
            var _a = router.forwardState(routeName, routeParams), name = _a.name, params = _a.params;
            return router.rootNode.buildState(name, params);
        };
        return router;
    }

    var eventsMap = {
        onStart: constants.ROUTER_START,
        onStop: constants.ROUTER_STOP,
        onTransitionSuccess: constants.TRANSITION_SUCCESS,
        onTransitionStart: constants.TRANSITION_START,
        onTransitionError: constants.TRANSITION_ERROR,
        onTransitionCancel: constants.TRANSITION_CANCEL
    };
    function withPlugins(router) {
        var routerPlugins = [];
        router.getPlugins = function () { return routerPlugins; };
        router.usePlugin = function () {
            var plugins = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                plugins[_i] = arguments[_i];
            }
            var removePluginFns = plugins.map(function (plugin) {
                routerPlugins.push(plugin);
                return startPlugin(plugin);
            });
            return function () {
                removePluginFns.forEach(function (removePlugin) { return removePlugin(); });
            };
        };
        function startPlugin(plugin) {
            var appliedPlugin = router.executeFactory(plugin);
            var removeEventListeners = Object.keys(eventsMap)
                .map(function (methodName) {
                if (appliedPlugin[methodName]) {
                    return router.addEventListener(eventsMap[methodName], appliedPlugin[methodName]);
                }
            })
                .filter(Boolean);
            return function () {
                removeEventListeners.forEach(function (removeListener) { return removeListener(); });
                if (plugin.teardown) {
                    plugin.teardown();
                }
            };
        }
        return router;
    }

    function withMiddleware(router) {
        var middlewareFactories = [];
        var middlewareFunctions = [];
        router.useMiddleware = function () {
            var middlewares = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                middlewares[_i] = arguments[_i];
            }
            middlewares.forEach(function (middleware) {
                middlewareFactories.push(middleware);
                middlewareFunctions.push(router.executeFactory(middleware));
            });
            return router;
        };
        router.clearMiddleware = function () {
            middlewareFactories = [];
            middlewareFunctions = [];
            return router;
        };
        router.getMiddlewareFactories = function () { return middlewareFactories; };
        router.getMiddlewareFunctions = function () { return middlewareFunctions; };
        return router;
    }

    function symbolObservablePonyfill(root) {
    	var result;
    	var Symbol = root.Symbol;

    	if (typeof Symbol === 'function') {
    		if (Symbol.observable) {
    			result = Symbol.observable;
    		} else {
    			result = Symbol('observable');
    			Symbol.observable = result;
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

    function withObservability(router) {
        var callbacks = {};
        router.invokeEventListeners = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (callbacks[eventName] || []).forEach(function (cb) { return cb.apply(void 0, args); });
        };
        router.removeEventListener = function (eventName, cb) {
            callbacks[eventName] = callbacks[eventName].filter(function (_cb) { return _cb !== cb; });
        };
        router.addEventListener = function (eventName, cb) {
            callbacks[eventName] = (callbacks[eventName] || []).concat(cb);
            return function () { return router.removeEventListener(eventName, cb); };
        };
        function subscribe(listener) {
            var isObject = typeof listener === 'object';
            var finalListener = isObject ? listener.next.bind(listener) : listener;
            var unsubscribeHandler = router.addEventListener(constants.TRANSITION_SUCCESS, function (toState, fromState) {
                finalListener({
                    route: toState,
                    previousRoute: fromState
                });
            });
            return isObject
                ? { unsubscribe: unsubscribeHandler }
                : unsubscribeHandler;
        }
        function observable() {
            var _a;
            return _a = {
                    subscribe: function (observer) {
                        if (typeof observer !== 'object' || observer === null) {
                            throw new TypeError('Expected the observer to be an object.');
                        }
                        return subscribe(observer);
                    }
                },
                _a[result] = function () {
                    return this;
                },
                _a;
        }
        router.subscribe = subscribe;
        //@ts-ignore
        router[result] = observable;
        //@ts-ignore
        router['@@observable'] = observable;
        return router;
    }

    var nameToIDs = function (name) {
        return name
            .split('.')
            .reduce(function (ids, name) {
            return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
        }, []);
    };
    var exists$1 = function (val) { return val !== undefined && val !== null; };
    var hasMetaParams = function (state) { return state && state.meta && state.meta.params; };
    var extractSegmentParams = function (name, state) {
        if (!hasMetaParams(state) || !exists$1(state.meta.params[name]))
            return {};
        return Object.keys(state.meta.params[name]).reduce(function (params, p) {
            params[p] = state.params[p];
            return params;
        }, {});
    };
    function transitionPath(toState, fromState) {
        var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
        var toStateIds = nameToIDs(toState.name);
        var maxI = Math.min(fromStateIds.length, toStateIds.length);
        function pointOfDifference() {
            var i;
            var _loop_1 = function () {
                var left = fromStateIds[i];
                var right = toStateIds[i];
                if (left !== right)
                    return { value: i };
                var leftParams = extractSegmentParams(left, toState);
                var rightParams = extractSegmentParams(right, fromState);
                if (Object.keys(leftParams).length !==
                    Object.keys(rightParams).length)
                    return { value: i };
                if (Object.keys(leftParams).length === 0)
                    return "continue";
                var different = Object.keys(leftParams).some(function (p) { return rightParams[p] !== leftParams[p]; });
                if (different) {
                    return { value: i };
                }
            };
            for (i = 0; i < maxI; i += 1) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return i;
        }
        var i;
        if (!fromState) {
            i = 0;
        }
        else if (!hasMetaParams(fromState) && !hasMetaParams(toState)) {
            i = 0;
        }
        else {
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

    function resolve(functions, _a, callback) {
        var isCancelled = _a.isCancelled, toState = _a.toState, fromState = _a.fromState, _b = _a.errorKey, errorKey = _b === void 0 ? undefined : _b;
        var remainingFunctions = Array.isArray(functions)
            ? functions
            : Object.keys(functions);
        var isState = function (obj) {
            return typeof obj === 'object' &&
                obj.name !== undefined &&
                obj.params !== undefined &&
                obj.path !== undefined;
        };
        var hasStateChanged = function (toState, fromState) {
            return fromState.name !== toState.name ||
                fromState.params !== toState.params ||
                fromState.path !== toState.path;
        };
        var mergeStates = function (toState, fromState) { return (__assign({}, fromState, toState, { meta: __assign({}, fromState.meta, toState.meta) })); };
        var processFn = function (stepFn, errBase, state, _done) {
            var done = function (err, newState) {
                if (err) {
                    _done(err);
                }
                else if (newState && newState !== state && isState(newState)) {
                    if (hasStateChanged(newState, state)) {
                        console.error('[router5][transition] Warning: state values (name, params, path) were changed during transition process.');
                    }
                    _done(null, mergeStates(newState, state));
                }
                else {
                    _done(null, state);
                }
            };
            var res = stepFn.call(null, state, fromState, done);
            if (isCancelled()) {
                done(null);
            }
            else if (typeof res === 'boolean') {
                done(res ? null : errBase);
            }
            else if (isState(res)) {
                done(null, res);
            }
            else if (res && typeof res.then === 'function') {
                res.then(function (resVal) {
                    if (resVal instanceof Error)
                        done({ error: resVal }, null);
                    else
                        done(null, resVal);
                }, function (err) {
                    if (err instanceof Error) {
                        console.error(err.stack || err);
                        done(__assign({}, errBase, { promiseError: err }), null);
                    }
                    else {
                        done(typeof err === 'object'
                            ? __assign({}, errBase, err) : errBase, null);
                    }
                });
            }
            // else: wait for done to be called
        };
        var next = function (err, state) {
            var _a;
            if (isCancelled()) {
                callback();
            }
            else if (err) {
                callback(err);
            }
            else {
                if (!remainingFunctions.length) {
                    callback(null, state);
                }
                else {
                    var isMapped = typeof remainingFunctions[0] === 'string';
                    var errBase = errorKey && isMapped
                        ? (_a = {}, _a[errorKey] = remainingFunctions[0], _a) : {};
                    var stepFn = isMapped
                        ? functions[remainingFunctions[0]]
                        : remainingFunctions[0];
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
        var _a = router.getLifecycleFunctions(), canDeactivateFunctions = _a[0], canActivateFunctions = _a[1];
        var middlewareFunctions = router.getMiddlewareFunctions();
        var isCancelled = function () { return cancelled; };
        var cancel = function () {
            if (!cancelled && !completed) {
                cancelled = true;
                callback({ code: errorCodes.TRANSITION_CANCELLED }, null);
            }
        };
        var done = function (err, state) {
            completed = true;
            if (isCancelled()) {
                return;
            }
            if (!err && options.autoCleanUp) {
                var activeSegments_1 = nameToIDs(toState.name);
                Object.keys(canDeactivateFunctions).forEach(function (name) {
                    if (activeSegments_1.indexOf(name) === -1)
                        router.clearCanDeactivate(name);
                });
            }
            callback(err, state || toState);
        };
        var makeError = function (base, err) { return (__assign({}, base, (err instanceof Object ? err : { error: err }))); };
        var isUnknownRoute = toState.name === constants.UNKNOWN_ROUTE;
        var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState };
        var _b = transitionPath(toState, fromState), toDeactivate = _b.toDeactivate, toActivate = _b.toActivate;
        var canDeactivate = !fromState || opts.forceDeactivate
            ? []
            : function (toState, fromState, cb) {
                var canDeactivateFunctionMap = toDeactivate
                    .filter(function (name) { return canDeactivateFunctions[name]; })
                    .reduce(function (fnMap, name) {
                    var _a;
                    return (__assign({}, fnMap, (_a = {}, _a[name] = canDeactivateFunctions[name], _a)));
                }, {});
                resolve(canDeactivateFunctionMap, __assign({}, asyncBase, { errorKey: 'segment' }), function (err) {
                    return cb(err
                        ? makeError({ code: errorCodes.CANNOT_DEACTIVATE }, err)
                        : null);
                });
            };
        var canActivate = isUnknownRoute
            ? []
            : function (toState, fromState, cb) {
                var canActivateFunctionMap = toActivate
                    .filter(function (name) { return canActivateFunctions[name]; })
                    .reduce(function (fnMap, name) {
                    var _a;
                    return (__assign({}, fnMap, (_a = {}, _a[name] = canActivateFunctions[name], _a)));
                }, {});
                resolve(canActivateFunctionMap, __assign({}, asyncBase, { errorKey: 'segment' }), function (err) {
                    return cb(err
                        ? makeError({ code: errorCodes.CANNOT_ACTIVATE }, err)
                        : null);
                });
            };
        var middleware = !middlewareFunctions.length
            ? []
            : function (toState, fromState, cb) {
                return resolve(middlewareFunctions, __assign({}, asyncBase), function (err, state) {
                    return cb(err
                        ? makeError({ code: errorCodes.TRANSITION_ERR }, err)
                        : null, state || toState);
                });
            };
        var pipeline = []
            .concat(canDeactivate)
            .concat(canActivate)
            .concat(middleware);
        resolve(pipeline, asyncBase, done);
        return cancel;
    }

    var noop = function (err, state) { };
    function withNavigation(router) {
        var cancelCurrentTransition;
        router.navigate = navigate;
        router.navigate = navigate;
        router.navigateToDefault = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var opts = typeof args[0] === 'object' ? args[0] : {};
            var done = args.length === 2
                ? args[1]
                : typeof args[0] === 'function' ? args[0] : noop;
            var options = router.getOptions();
            if (options.defaultRoute) {
                return navigate(options.defaultRoute, options.defaultParams, opts, done);
            }
            return function () { };
        };
        router.cancel = function () {
            if (cancelCurrentTransition) {
                cancelCurrentTransition('navigate');
                cancelCurrentTransition = null;
            }
            return router;
        };
        function navigate() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var name = args[0];
            var lastArg = args[args.length - 1];
            var done = typeof lastArg === 'function' ? lastArg : noop;
            var params = typeof args[1] === 'object' ? args[1] : {};
            var opts = typeof args[2] === 'object' ? args[2] : {};
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
            var sameStates = router.getState()
                ? router.areStatesEqual(router.getState(), toState, false)
                : false;
            // Do not proceed further if states are the same and no reload
            // (no deactivation and no callbacks)
            if (sameStates && !opts.reload && !opts.force) {
                var err = { code: errorCodes.SAME_STATES };
                done(err);
                router.invokeEventListeners(constants.TRANSITION_ERROR, toState, router.getState(), err);
                return;
            }
            var fromState = sameStates || opts.reload ? null : router.getState();
            if (opts.skipTransition) {
                done(null, toState);
                return noop;
            }
            // Transition
            return router.transitionToState(toState, fromState, opts, function (err, state) {
                if (err) {
                    if (err.redirect) {
                        var _a = err.redirect, name_1 = _a.name, params_1 = _a.params;
                        navigate(name_1, params_1, __assign({}, opts, { force: true, redirected: true }), done);
                    }
                    else {
                        done(err);
                    }
                }
                else {
                    router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, fromState, opts);
                    done(null, state);
                }
            });
        }
        router.transitionToState = function (toState, fromState, options, done) {
            if (options === void 0) { options = {}; }
            if (done === void 0) { done = noop; }
            router.cancel();
            router.invokeEventListeners(constants.TRANSITION_START, toState, fromState);
            cancelCurrentTransition = transition(router, toState, fromState, options, function (err, state) {
                cancelCurrentTransition = null;
                state = state || toState;
                if (err) {
                    if (err.code === errorCodes.TRANSITION_CANCELLED) {
                        router.invokeEventListeners(constants.TRANSITION_CANCEL, toState, fromState);
                    }
                    else {
                        router.invokeEventListeners(constants.TRANSITION_ERROR, toState, fromState, err);
                    }
                    done(err);
                }
                else {
                    router.setState(state);
                    done(null, state);
                }
            });
            return cancelCurrentTransition;
        };
        return router;
    }

    var noop$1 = function () { };
    function withRouterLifecycle(router) {
        var started = false;
        router.isStarted = function () { return started; };
        //@ts-ignore
        router.start = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var options = router.getOptions();
            var lastArg = args[args.length - 1];
            var done = typeof lastArg === 'function' ? lastArg : noop$1;
            var startPathOrState = typeof args[0] !== 'function' ? args[0] : undefined;
            if (started) {
                done({ code: errorCodes.ROUTER_ALREADY_STARTED });
                return router;
            }
            var startPath, startState;
            started = true;
            router.invokeEventListeners(constants.ROUTER_START);
            // callback
            var cb = function (err, state, invokeErrCb) {
                if (invokeErrCb === void 0) { invokeErrCb = true; }
                if (!err)
                    router.invokeEventListeners(constants.TRANSITION_SUCCESS, state, null, { replace: true });
                if (err && invokeErrCb)
                    router.invokeEventListeners(constants.TRANSITION_ERROR, state, null, err);
                done(err, state);
            };
            if (startPathOrState === undefined && !options.defaultRoute) {
                return cb({ code: errorCodes.NO_START_PATH_OR_STATE });
            }
            if (typeof startPathOrState === 'string') {
                startPath = startPathOrState;
            }
            else if (typeof startPathOrState === 'object') {
                startState = startPathOrState;
            }
            if (!startState) {
                // If no supplied start state, get start state
                startState =
                    startPath === undefined ? null : router.matchPath(startPath);
                // Navigate to default function
                var navigateToDefault_1 = function () {
                    return router.navigateToDefault({ replace: true }, done);
                };
                var redirect_1 = function (route) {
                    return router.navigate(route.name, route.params, { replace: true, reload: true, redirected: true }, done);
                };
                var transitionToState = function (state) {
                    router.transitionToState(state, router.getState(), {}, function (err, state) {
                        if (!err)
                            cb(null, state);
                        else if (err.redirect)
                            redirect_1(err.redirect);
                        else if (options.defaultRoute)
                            navigateToDefault_1();
                        else
                            cb(err, null, false);
                    });
                };
                // If matched start path
                if (startState) {
                    transitionToState(startState);
                }
                else if (options.defaultRoute) {
                    // If default, navigate to default
                    navigateToDefault_1();
                }
                else if (options.allowNotFound) {
                    transitionToState(router.makeNotFoundState(startPath, { replace: true }));
                }
                else {
                    // No start match, no default => do nothing
                    cb({ code: errorCodes.ROUTE_NOT_FOUND, path: startPath }, null);
                }
            }
            else {
                // Initialise router with provided start state
                router.setState(startState);
                cb(null, startState);
            }
            return router;
        };
        router.stop = function () {
            if (started) {
                router.setState(null);
                started = false;
                router.invokeEventListeners(constants.ROUTER_STOP);
            }
            return router;
        };
        return router;
    }

    var toFunction = function (val) { return (typeof val === 'function' ? val : function () { return function () { return val; }; }); };
    function withRouteLifecycle(router) {
        var canDeactivateFactories = {};
        var canActivateFactories = {};
        var canDeactivateFunctions = {};
        var canActivateFunctions = {};
        router.getLifecycleFactories = function () {
            return [canDeactivateFactories, canActivateFactories];
        };
        router.getLifecycleFunctions = function () {
            return [canDeactivateFunctions, canActivateFunctions];
        };
        router.canDeactivate = function (name, canDeactivateHandler) {
            var factory = toFunction(canDeactivateHandler);
            canDeactivateFactories[name] = factory;
            canDeactivateFunctions[name] = router.executeFactory(factory);
            return router;
        };
        router.clearCanDeactivate = function (name) {
            canDeactivateFactories[name] = undefined;
            canDeactivateFunctions[name] = undefined;
            return router;
        };
        router.canActivate = function (name, canActivateHandler) {
            var factory = toFunction(canActivateHandler);
            canActivateFactories[name] = factory;
            canActivateFunctions[name] = router.executeFactory(factory);
            return router;
        };
        return router;
    }

    var pipe = function () {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i] = arguments[_i];
        }
        return function (arg) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, arg);
        };
    };
    var createRouter = function (routes, options, dependencies) {
        var config = {
            decoders: {},
            encoders: {},
            defaultParams: {},
            forwardMap: {}
        };
        return pipe(withOptions(options), withRoutes(routes), withDependencies(dependencies), withObservability, withState, withRouterLifecycle, withRouteLifecycle, withNavigation, withPlugins, withMiddleware)({ config: config });
    };

    function cloneRouter(router, dependencies) {
        var clonedRouter = createRouter(router.rootNode, router.getOptions(), dependencies);
        clonedRouter.useMiddleware.apply(clonedRouter, router.getMiddlewareFactories());
        clonedRouter.usePlugin.apply(clonedRouter, router.getPlugins());
        clonedRouter.config = router.config;
        var _a = router.getLifecycleFactories(), canDeactivateFactories = _a[0], canActivateFactories = _a[1];
        Object.keys(canDeactivateFactories).forEach(function (name) {
            return clonedRouter.canDeactivate(name, canDeactivateFactories[name]);
        });
        Object.keys(canActivateFactories).forEach(function (name) {
            return clonedRouter.canActivate(name, canActivateFactories[name]);
        });
        return clonedRouter;
    }

    exports.createRouter = createRouter;
    exports.cloneRouter = cloneRouter;
    exports.RouteNode = RouteNode;
    exports.transitionPath = transitionPath;
    exports.constants = constants;
    exports.errorCodes = errorCodes;
    exports.default = createRouter;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
