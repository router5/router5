'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var router5TransitionPath = require('router5-transition-path');

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var RouterProvider = /** @class */ (function (_super) {
    __extends(RouterProvider, _super);
    function RouterProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.router = props.router;
        return _this;
    }
    RouterProvider.prototype.getChildContext = function () {
        return { router: this.router };
    };
    RouterProvider.prototype.render = function () {
        var children = this.props.children;
        return React.Children.only(children);
    };
    RouterProvider.childContextTypes = {
        router: PropTypes.object.isRequired
    };
    return RouterProvider;
}(React.Component));

var BaseLink = /** @class */ (function (_super) {
    __extends(BaseLink, _super);
    function BaseLink(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.router = _this.props.router;
        _this.isActive = _this.isActive.bind(_this);
        _this.clickHandler = _this.clickHandler.bind(_this);
        _this.callback = _this.callback.bind(_this);
        _this.state = { active: _this.isActive() };
        return _this;
    }
    BaseLink.prototype.buildUrl = function (routeName, routeParams) {
        //@ts-ignore
        if (this.router.buildUrl) {
            //@ts-ignore
            return this.router.buildUrl(routeName, routeParams);
        }
        return this.router.buildPath(routeName, routeParams);
    };
    BaseLink.prototype.isActive = function () {
        var _a = this.props, routeName = _a.routeName, _b = _a.routeParams, routeParams = _b === void 0 ? {} : _b, _c = _a.activeStrict, activeStrict = _c === void 0 ? false : _c, _d = _a.ignoreQueryParams, ignoreQueryParams = _d === void 0 ? true : _d;
        return this.router.isActive(routeName, routeParams, activeStrict, ignoreQueryParams);
    };
    BaseLink.prototype.callback = function (err, state) {
        if (!err && this.props.successCallback) {
            this.props.successCallback(state);
        }
        if (err && this.props.errorCallback) {
            this.props.errorCallback(err);
        }
    };
    BaseLink.prototype.clickHandler = function (evt) {
        var _a = this.props, onClick = _a.onClick, target = _a.target;
        if (onClick) {
            onClick(evt);
            if (evt.defaultPrevented) {
                return;
            }
        }
        var comboKey = evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;
        if (evt.button === 0 && !comboKey && target !== '_blank') {
            evt.preventDefault();
            this.router.navigate(this.props.routeName, this.props.routeParams || {}, this.props.routeOptions || {}, this.callback);
        }
    };
    BaseLink.prototype.render = function () {
        /* eslint-disable */
        var _a = this.props, routeName = _a.routeName, routeParams = _a.routeParams, routeOptions = _a.routeOptions, className = _a.className, _b = _a.activeClassName, activeClassName = _b === void 0 ? 'active' : _b, activeStrict = _a.activeStrict, ignoreQueryParams = _a.ignoreQueryParams, route = _a.route, previousRoute = _a.previousRoute, router = _a.router, children = _a.children, onClick = _a.onClick, successCallback = _a.successCallback, errorCallback = _a.errorCallback, linkProps = __rest(_a, ["routeName", "routeParams", "routeOptions", "className", "activeClassName", "activeStrict", "ignoreQueryParams", "route", "previousRoute", "router", "children", "onClick", "successCallback", "errorCallback"]);
        /* eslint-enable */
        var active = this.isActive();
        var href = this.buildUrl(routeName, routeParams);
        var linkclassName = (active ? [activeClassName] : [])
            .concat(className ? className.split(' ') : [])
            .join(' ');
        return React__default.createElement('a', __assign(__assign({}, linkProps), { href: href, className: linkclassName, onClick: this.clickHandler }), children);
    };
    return BaseLink;
}(React.Component));

function withRouter(BaseComponent) {
    var WithRouter = /** @class */ (function (_super) {
        __extends(WithRouter, _super);
        function WithRouter(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.router = context.router;
            return _this;
        }
        WithRouter.prototype.render = function () {
            return React.createElement(BaseComponent, __assign(__assign({}, this.props), { router: this.router }));
        };
        WithRouter.contextTypes = {
            router: PropTypes.object.isRequired
        };
        return WithRouter;
    }(React.Component));
    WithRouter.contextTypes = {
        router: PropTypes.object.isRequired
    };
    return WithRouter;
}

function withRoute(BaseComponent) {
    var WithRoute = /** @class */ (function (_super) {
        __extends(WithRoute, _super);
        function WithRoute(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.router = context.router;
            _this.routeState = {
                previousRoute: null,
                route: _this.router.getState()
            };
            _this.mounted = false;
            if (typeof window !== 'undefined') {
                var listener = function (_a) {
                    var route = _a.route, previousRoute = _a.previousRoute;
                    _this.routeState = {
                        route: route,
                        previousRoute: previousRoute
                    };
                    if (_this.mounted) {
                        _this.forceUpdate();
                    }
                };
                _this.unsubscribe = _this.router.subscribe(listener);
            }
            return _this;
        }
        WithRoute.prototype.componentDidMount = function () {
            this.mounted = true;
        };
        WithRoute.prototype.componentWillUnmount = function () {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        };
        WithRoute.prototype.render = function () {
            return React.createElement(BaseComponent, __assign(__assign(__assign({}, this.props), this.routeState), { router: this.router }));
        };
        WithRoute.contextTypes = {
            router: PropTypes.object.isRequired
        };
        return WithRoute;
    }(React.Component));
    return WithRoute;
}

function routeNode(nodeName) {
    return function routeNodeWrapper(RouteSegment) {
        var RouteNode = /** @class */ (function (_super) {
            __extends(RouteNode, _super);
            function RouteNode(props, context) {
                var _this = _super.call(this, props, context) || this;
                _this.router = context.router;
                _this.routeState = {
                    previousRoute: null,
                    route: _this.router.getState()
                };
                _this.mounted = false;
                if (typeof window !== 'undefined') {
                    var listener = function (_a) {
                        var route = _a.route, previousRoute = _a.previousRoute;
                        if (router5TransitionPath.shouldUpdateNode(nodeName)(route, previousRoute)) {
                            _this.routeState = {
                                previousRoute: previousRoute,
                                route: route
                            };
                            if (_this.mounted) {
                                _this.forceUpdate();
                            }
                        }
                    };
                    _this.unsubscribe = _this.router.subscribe(listener);
                }
                return _this;
            }
            RouteNode.prototype.componentDidMount = function () {
                this.mounted = true;
            };
            RouteNode.prototype.componentWillUnmount = function () {
                if (this.unsubscribe) {
                    this.unsubscribe();
                }
            };
            RouteNode.prototype.render = function () {
                var _a = this, props = _a.props, router = _a.router;
                var _b = this.routeState, previousRoute = _b.previousRoute, route = _b.route;
                var component = React.createElement(RouteSegment, __assign(__assign({}, props), { router: router,
                    previousRoute: previousRoute,
                    route: route }));
                return component;
            };
            RouteNode.contextTypes = {
                router: PropTypes.object.isRequired
            };
            return RouteNode;
        }(React.Component));
        return RouteNode;
    };
}

var ConnectedLink = withRoute(BaseLink);
var Link = withRouter(BaseLink);

exports.BaseLink = BaseLink;
exports.ConnectedLink = ConnectedLink;
exports.Link = Link;
exports.RouterProvider = RouterProvider;
exports.routeNode = routeNode;
exports.withRoute = withRoute;
exports.withRouter = withRouter;
