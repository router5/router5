(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('dekuRouter5', ['exports'], factory) :
  (factory((global.dekuRouter5 = global.dekuRouter5 || {})));
}(this, function (exports) { 'use strict';

  var Link = {
      propTypes: {
          router: { source: 'router' },
          route: { source: 'route' },
          button: { type: 'boolean' },
          routeName: { type: 'string', optional: false },
          routeParams: { type: 'object' },
          routeOptions: { type: 'object' },
          activeClass: { type: 'string' },
          activeStrict: { type: 'function' },
          onClick: { type: 'function' }
      },

      defaultProps: {
          activeClass: 'active',
          button: false,
          activeStrict: false,
          routeParams: {},
          routeOptions: {}
      },

      render: function render(_ref) {
          var props = _ref.props;
          var button = props.button,
              activeClass = props.activeClass,
              routeName = props.routeName,
              routeParams = props.routeParams,
              routeOptions = props.routeOptions,
              children = props.children,
              router = props.router;


          var clickHandler = function clickHandler(evt) {
              evt.preventDefault();
              router.navigate(routeName, routeParams, routeOptions);
          };

          var active = router.isActive(routeName, routeParams);
          var href = router.buildUrl(routeName, routeParams);

          var className = (props.class ? props.class.split(' ') : []).concat(active ? [activeClass] : []).join(' ');

          var onClick = props.onClick || clickHandler;

          if (button) {
              return element('button', { type: 'button', 'class': className, onClick: onClick }, children);
          }

          return { type: 'a', children: children, attributes: { href: href, 'class': className, onClick: onClick } };
      }
  };

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
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

  function routeNode(nodeName) {
      return function routeNodeWrapper(RouteSegment) {
          var RouteNode = {
              propTypes: {
                  router: { source: 'router' }
              },

              afterMount: function afterMount(_ref, elm, setState) {
                  var props = _ref.props;

                  props.router.addNodeListener(nodeName, function (toState, fromState) {
                      setState({ route: toState, previousRoute: fromState });
                  });
              },
              render: function render(_ref2) {
                  var props = _ref2.props,
                      state = _ref2.state;
                  var route = state.route,
                      previousRoute = state.previousRoute;


                  if (route === undefined) {
                      route = props.router.getState();
                      previousRoute = null;
                  }

                  return { type: RouteSegment, children: [], attributes: _extends({}, props, { route: route, previousRoute: previousRoute }) };
              }
          };

          return RouteNode;
      };
  }

  var routerPlugin = function routerPlugin(router) {
      return function (app) {
          app.set('router', router);
          app.set('route', router.getState());
          router.addListener(function (toState) {
              return app.set('route', toState);
          });
      };
  };

  exports.Link = Link;
  exports.routeNode = routeNode;
  exports.routerPlugin = routerPlugin;

  Object.defineProperty(exports, '__esModule', { value: true });

}));