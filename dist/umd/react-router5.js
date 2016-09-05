(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define('reactRouter5', ['exports', 'react'], factory) :
  (factory((global.reactRouter5 = global.reactRouter5 || {}),global.React));
}(this, (function (exports,React) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;

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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var BaseLink = function (_Component) {
    inherits(BaseLink, _Component);

    function BaseLink(props, context) {
        classCallCheck(this, BaseLink);

        var _this = possibleConstructorReturn(this, (BaseLink.__proto__ || Object.getPrototypeOf(BaseLink)).call(this, props, context));

        _this.router = context.router;

        if (!_this.router.hasPlugin('BROWSER_PLUGIN')) {
            console.error('[react-router5][BaseLink] missing browser plugin, href might be build incorrectly');
        };

        _this.isActive = _this.isActive.bind(_this);
        _this.clickHandler = _this.clickHandler.bind(_this);

        _this.state = { active: _this.isActive() };
        return _this;
    }

    createClass(BaseLink, [{
        key: 'buildUrl',
        value: function buildUrl(routeName, routeParams) {
            if (this.router.buildUrl) {
                return this.router.buildUrl(routeName, routeParams);
            }

            return this.router.builPath(routeName, routeParams);
        }
    }, {
        key: 'isActive',
        value: function isActive() {
            return this.router.isActive(this.props.routeName, this.props.routeParams, this.props.activeStrict);
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

            var comboKey = evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey;

            if (evt.button === 0 && !comboKey) {
                evt.preventDefault();
                this.router.navigate(this.props.routeName, this.props.routeParams, this.props.routeOptions);
            }
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


            var active = this.isActive();
            var href = this.buildUrl(routeName, routeParams);
            var linkclassName = (className ? className.split(' ') : []).concat(active ? [activeClassName] : []).join(' ');

            var onClick = this.clickHandler;

            return React__default.createElement('a', { href: href, className: linkclassName, onClick: onClick }, children);
        }
    }]);
    return BaseLink;
}(React.Component);

BaseLink.contextTypes = {
    router: React__default.PropTypes.object.isRequired
};

// BaseLink.propTypes = {
//     routeName:       React.PropTypes.string.isRequired,
//     routeParams:     React.PropTypes.object,
//     routeOptions:    React.PropTypes.object,
//     activeClassName: React.PropTypes.string,
//     activeStrict:    React.PropTypes.bool,
//     onClick:         React.PropTypes.func
// };

BaseLink.defaultProps = {
    activeClassName: 'active',
    activeStrict: false,
    routeParams: {},
    routeOptions: {}
};

var getDisplayName = function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
};

var ifNot = function ifNot(condition, errorMessage) {
    if (!condition) throw new Error(errorMessage);
};

function routeNode(nodeName) {
    return function routeNodeWrapper(RouteSegment) {
        var RouteNode = function (_Component) {
            inherits(RouteNode, _Component);

            function RouteNode(props, context) {
                classCallCheck(this, RouteNode);

                var _this = possibleConstructorReturn(this, (RouteNode.__proto__ || Object.getPrototypeOf(RouteNode)).call(this, props, context));

                _this.router = context.router;
                _this.state = {
                    previousRoute: null,
                    route: _this.router.getState()
                };
                return _this;
            }

            createClass(RouteNode, [{
                key: 'componentDidMount',
                value: function componentDidMount() {
                    var _this2 = this;

                    ifNot(this.router.hasPlugin('LISTENERS_PLUGIN'), '[react-router5][routeNode] missing listeners plugin');

                    this.nodeListener = function (toState, fromState) {
                        return _this2.setState({ previousRoute: fromState, route: toState });
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
                    var router = this.router;
                    var _state = this.state;
                    var previousRoute = _state.previousRoute;
                    var route = _state.route;

                    var component = React.createElement(RouteSegment, _extends({}, props, { router: router, previousRoute: previousRoute, route: route }));

                    return component;
                }
            }]);
            return RouteNode;
        }(React.Component);

        RouteNode.contextTypes = {
            router: React__default.PropTypes.object.isRequired
        };

        RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';

        return RouteNode;
    };
}

var RouterProvider = function (_Component) {
    inherits(RouterProvider, _Component);

    function RouterProvider(props, context) {
        classCallCheck(this, RouterProvider);

        var _this = possibleConstructorReturn(this, (RouterProvider.__proto__ || Object.getPrototypeOf(RouterProvider)).call(this, props, context));

        _this.router = props.router;
        return _this;
    }

    createClass(RouterProvider, [{
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

            return React.Children.only(children);
        }
    }]);
    return RouterProvider;
}(React.Component);

RouterProvider.propTypes = {
    router: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
};

RouterProvider.childContextTypes = {
    router: React.PropTypes.object.isRequired
};

function withRoute(BaseComponent) {
    var ComponentWithRoute = function (_Component) {
        inherits(ComponentWithRoute, _Component);

        function ComponentWithRoute(props, context) {
            classCallCheck(this, ComponentWithRoute);

            var _this = possibleConstructorReturn(this, (ComponentWithRoute.__proto__ || Object.getPrototypeOf(ComponentWithRoute)).call(this, props, context));

            _this.router = context.router;
            _this.state = {
                previousRoute: null,
                route: _this.router.getState()
            };
            _this.listener = _this.listener.bind(_this);
            return _this;
        }

        createClass(ComponentWithRoute, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                ifNot(this.router.hasPlugin('LISTENERS_PLUGIN'), '[react-router5][withRoute] missing listeners plugin');

                this.listener = function (toState, fromState) {
                    return _this2.setState({ previousRoute: fromState, route: toState });
                };
                this.router.addListener(this.listener);
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.router.removeListener(this.listener);
            }
        }, {
            key: 'listener',
            value: function listener(toState, fromState) {
                this.setState({
                    previousRoute: fromState,
                    route: toState
                });
            }
        }, {
            key: 'render',
            value: function render() {
                ifNot(!this.props.router && !this.props.route && !this.props.previousRoute, '[react-router5] prop names `router`, `route` and `previousRoute` are reserved.');

                return React.createElement(BaseComponent, _extends({}, this.props, this.state, { router: this.router }));
            }
        }]);
        return ComponentWithRoute;
    }(React.Component);

    ComponentWithRoute.contextTypes = {
        router: React__default.PropTypes.object.isRequired
    };

    ComponentWithRoute.displayName = 'WithRoute[' + getDisplayName(BaseComponent) + ']';

    return ComponentWithRoute;
}

var Link = withRoute(BaseLink);

exports.BaseLink = BaseLink;
exports.routeNode = routeNode;
exports.RouterProvider = RouterProvider;
exports.withRoute = withRoute;
exports.Link = Link;

Object.defineProperty(exports, '__esModule', { value: true });

})));