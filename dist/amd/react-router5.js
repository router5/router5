/**
 * @license
 * @version 1.0.1
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
define('reactRouter5', ['react'], function (React) {
"use strict";

    var Component = React.Component;
    var PropTypes = React.PropTypes;
    var Children = React.Children;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
    
    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
    
    var Link = (function (_Component) {
        _inherits(Link, _Component);
    
        function Link(props, context) {
            _classCallCheck(this, Link);
    
            _get(Object.getPrototypeOf(Link.prototype), 'constructor', this).call(this, props, context);
            this.router = context.router;
    
            this.isActive = this.isActive.bind(this);
            this.clickHandler = this.clickHandler.bind(this);
            this.routeChangeHandler = this.routeChangeHandler.bind(this);
    
            this.state = { active: this.isActive() };
        }
    
        _createClass(Link, [{
            key: 'isActive',
            value: function isActive() {
                return this.router.isActive(this.props.routeName, this.props.routeParams);
            }
        }, {
            key: 'clickHandler',
            value: function clickHandler(evt) {
                if (this.props.onClick) {
                    this.props.onClick(evt);
    
                    if (evt.defaultPrevented) {
                        return;
                    }
                }
    
                var comboKey = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
    
                if (evt.button === 0 && !comboKey) {
                    evt.preventDefault();
                    this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
                }
            }
        }, {
            key: 'routeChangeHandler',
            value: function routeChangeHandler(toState, fromState) {
                this.setState({ active: this.isActive() });
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                this.router.addListener(this.routeChangeHandler);
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.router.removeListener(this.routeChangeHandler);
            }
        }, {
            key: 'render',
            value: function render() {
                var _props = this.props;
                var routeName = _props.routeName;
                var routeParams = _props.routeParams;
                var className = _props.className;
                var activeClassName = _props.activeClassName;
                var children = _props.children;
                var active = this.state.active;
    
                var href = this.router.buildUrl(routeName, routeParams);
                var linkclassName = (className ? className.split(' ') : []).concat(active ? [activeClassName] : []).join(' ');
    
                var onClick = this.clickHandler;
    
                return React.createElement('a', { href: href, className: linkclassName, onClick: onClick }, children);
            }
        }]);
    
        return Link;
    })(Component);
    
    Link.contextTypes = {
        router: PropTypes.object.isRequired
    };
    
    Link.propTypes = {
        routeName: PropTypes.string.isRequired,
        routeParams: PropTypes.object,
        routeOptions: PropTypes.object,
        activeClassName: PropTypes.string,
        activeStrict: PropTypes.bool,
        onClick: PropTypes.func
    };
    
    Link.defaultProps = {
        activeClassName: 'active',
        activeStrict: false,
        routeParams: {},
        routeOptions: {}
    };
    
    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
    
    
    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
    
    var RouterProvider = (function (_Component) {
        _inherits(RouterProvider, _Component);
    
        function RouterProvider(props, context) {
            _classCallCheck(this, RouterProvider);
    
            _get(Object.getPrototypeOf(RouterProvider.prototype), 'constructor', this).call(this, props, context);
            this.router = props.router;
        }
    
        _createClass(RouterProvider, [{
            key: 'getChildContext',
            value: function getChildContext() {
                return { router: this.router };
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                if (this.props.router !== nextProps.router) {
                    console.error('[react-router5][Router]does not support changing the router object.');
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var children = this.props.children;
    
                return Children.only(children);
            }
        }]);
    
        return RouterProvider;
    })(Component);
    
    RouterProvider.propTypes = {
        router: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };
    
    RouterProvider.childContextTypes = {
        router: PropTypes.object.isRequired
    };
    
    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
    
    
    var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
    
    
    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
    
    function getDisplayName(component) {
        return component.displayName || component.name || 'Component';
    }
    
    function routeNode(nodeName) {
        var register = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    
        return function routeNodeWrapper(RouteSegment) {
            var RouteNode = (function (_Component) {
                _inherits(RouteNode, _Component);
    
                function RouteNode(props, context) {
                    _classCallCheck(this, RouteNode);
    
                    _get(Object.getPrototypeOf(RouteNode.prototype), 'constructor', this).call(this, props, context);
                    this.router = context.router;
                    this.state = {
                        previousRoute: null,
                        route: this.router.getState()
                    };
                }
    
                _createClass(RouteNode, [{
                    key: 'componentDidMount',
                    value: function componentDidMount() {
                        var _this = this;
    
                        if (register) this.router.registerComponent(nodeName, this.refs.wrappedInstance);
    
                        if (!this.router.registeredPlugins.LISTENERS) {
                            throw new Error('[react-router5][RouteNode] missing plugin router5-listeners.');
                        }
    
                        this.nodeListener = function (toState, fromState) {
                            return _this.setState({ previousRoute: fromState, route: toState });
                        };
                        this.router.addNodeListener(nodeName, this.nodeListener);
                    }
                }, {
                    key: 'componentWillUnmout',
                    value: function componentWillUnmout() {
                        this.router.removeNodeListener(nodeName, this.nodeListener);
                    }
                }, {
                    key: 'render',
                    value: function render() {
                        var props = this.props;
                        var _state = this.state;
                        var previousRoute = _state.previousRoute;
                        var route = _state.route;
    
                        var component = React.createElement(RouteSegment, _extends({}, props, { previousRoute: previousRoute, route: route, ref: register ? 'wrappedInstance' : undefined }));
    
                        return component;
                    }
                }]);
    
                return RouteNode;
            })(Component);
    
            RouteNode.contextTypes = {
                router: PropTypes.object.isRequired
            };
    
            RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';
    
            return RouteNode;
        };
    }

    return {Link: Link, RouterProvider: RouterProvider, routeNode: routeNode};
});
