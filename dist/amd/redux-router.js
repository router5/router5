define('reduxRouter5', ['exports'], function (exports) { 'use strict';

    var babelHelpers = {};
    babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
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

    babelHelpers.toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    babelHelpers;

    function defaultEqualityCheck(a, b) {
        return a === b;
    }

    function defaultMemoize(func) {
        var equalityCheck = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCheck : arguments[1];

        var lastArgs = null;
        var lastResult = null;
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (lastArgs !== null && args.every(function (value, index) {
                return equalityCheck(value, lastArgs[index]);
            })) {
                return lastResult;
            }
            lastArgs = args;
            lastResult = func.apply(undefined, args);
            return lastResult;
        };
    }

    function getDependencies(funcs) {
        var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

        if (!dependencies.every(function (dep) {
            return typeof dep === 'function';
        })) {
            var dependencyTypes = dependencies.map(function (dep) {
                return typeof dep === 'undefined' ? 'undefined' : babelHelpers.typeof(dep);
            }).join(', ');
            throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
        }

        return dependencies;
    }

    function createSelectorCreator(memoize) {
        for (var _len2 = arguments.length, memoizeOptions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            memoizeOptions[_key2 - 1] = arguments[_key2];
        }

        return function () {
            for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                funcs[_key3] = arguments[_key3];
            }

            var recomputations = 0;
            var resultFunc = funcs.pop();
            var dependencies = getDependencies(funcs);

            var memoizedResultFunc = memoize.apply(undefined, [function () {
                recomputations++;
                return resultFunc.apply(undefined, arguments);
            }].concat(memoizeOptions));

            var selector = function selector(state, props) {
                for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                    args[_key4 - 2] = arguments[_key4];
                }

                var params = dependencies.map(function (dependency) {
                    return dependency.apply(undefined, [state, props].concat(args));
                });
                return memoizedResultFunc.apply(undefined, babelHelpers.toConsumableArray(params));
            };

            selector.recomputations = function () {
                return recomputations;
            };
            return selector;
        };
    }

    function createSelector() {
        return createSelectorCreator(defaultMemoize).apply(undefined, arguments);
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
            var i = undefined;

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

        var i = undefined;
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

    function routeNodeSelector(routeNode) {
        var reducerKey = arguments.length <= 1 || arguments[1] === undefined ? 'router' : arguments[1];

        var routerStateSelector = function routerStateSelector(state) {
            return state[reducerKey];
        };

        var routeIntersectionSelector = createSelector(routerStateSelector, function (_ref) {
            var route = _ref.route;
            var previousRoute = _ref.previousRoute;

            var intersection = route ? transitionPath(route, previousRoute).intersection : '';
            return { route: route, intersection: intersection };
        });

        // We trick the selector to think that no change happenned if the intersection of an update
        // is not the defined routeNode.
        var createIntersectionSelector = createSelectorCreator(defaultMemoize, function (_ref2, previous) {
            var intersection = _ref2.intersection;
            var route = _ref2.route;
            return previous.route === route || intersection !== routeNode;
        });

        return createIntersectionSelector(routeIntersectionSelector, function (_ref3) {
            var route = _ref3.route;
            return { route: route };
        });
    }

    var NAVIGATE_TO = 'R5_NAVIGATE';
    var CANCEL_TRANSITION = 'R5_CANCEL';
    var TRANSITION_ERROR = 'R5_TRANSITION_ERROR';
    var TRANSITION_SUCCESS = 'R5_TRANSITION_SUCCESS';
    var TRANSITION_START = 'R5_TRANSITION_START';
    var CLEAR_ERRORS = 'R5_CLEAR_ERRORS';

var actionTypes = Object.freeze({
    	NAVIGATE_TO: NAVIGATE_TO,
    	CANCEL_TRANSITION: CANCEL_TRANSITION,
    	TRANSITION_ERROR: TRANSITION_ERROR,
    	TRANSITION_SUCCESS: TRANSITION_SUCCESS,
    	TRANSITION_START: TRANSITION_START,
    	CLEAR_ERRORS: CLEAR_ERRORS
    });

    function navigateTo(name) {
        var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return {
            type: NAVIGATE_TO,
            payload: {
                name: name,
                params: params,
                opts: opts
            }
        };
    }

    function cancelTransition() {
        return {
            type: CANCEL_TRANSITION
        };
    }

    function clearErrors() {
        return {
            type: CLEAR_ERRORS
        };
    }

    function transitionStart(route, previousRoute) {
        return {
            type: TRANSITION_START,
            payload: {
                route: route,
                previousRoute: previousRoute
            }
        };
    }

    function transitionSuccess(route, previousRoute) {
        return {
            type: TRANSITION_SUCCESS,
            payload: {
                route: route,
                previousRoute: previousRoute
            }
        };
    }

    function transitionError(route, previousRoute, transitionError) {
        return {
            type: TRANSITION_ERROR,
            payload: {
                route: route,
                previousRoute: previousRoute,
                transitionError: transitionError
            }
        };
    }

var actions = Object.freeze({
        navigateTo: navigateTo,
        cancelTransition: cancelTransition,
        clearErrors: clearErrors,
        transitionStart: transitionStart,
        transitionSuccess: transitionSuccess,
        transitionError: transitionError
    });

    var initialState = {
        route: null,
        previousRoute: null,
        transitionRoute: null,
        transitionError: null
    };

    function router5Reducer() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
        var action = arguments[1];

        switch (action.type) {
            case TRANSITION_START:
                return babelHelpers.extends({}, state, {
                    transitionRoute: action.payload.route,
                    transitionError: null
                });

            case TRANSITION_SUCCESS:
                return babelHelpers.extends({}, state, {
                    transitionRoute: null,
                    transitionError: null,
                    previousRoute: action.payload.previousRoute,
                    route: action.payload.route
                });

            case TRANSITION_ERROR:
                return babelHelpers.extends({}, state, {
                    transitionRoute: action.payload.route,
                    transitionError: action.payload.transitionError
                });

            case CLEAR_ERRORS:
                return babelHelpers.extends({}, state, {
                    transitionRoute: null,
                    transitionError: null
                });

            default:
                return state;
        }
    }

    var routerPlugin = function routerPlugin(dispatch) {
        return function () {
            return {
                name: 'REDUX_PLUGIN',
                onTransitionStart: function onTransitionStart(toState, fromState) {
                    dispatch(transitionStart(toState, fromState));
                },
                onTransitionSuccess: function onTransitionSuccess(toState, fromState) {
                    dispatch(transitionSuccess(toState, fromState));
                },
                onTransitionError: function onTransitionError(toState, fromState, err) {
                    dispatch(transitionError(toState, fromState, err));
                }
            };
        };
    };

    var router5ReduxMiddleware = function router5ReduxMiddleware(router) {
        return function (store) {
            var dispatch = store.dispatch;

            router.setAdditionalArgs(store);
            router.usePlugin(routerPlugin(dispatch));

            return function (next) {
                return function (action) {
                    if (action.type === NAVIGATE_TO) {
                        var _action$payload = action.payload;
                        var name = _action$payload.name;
                        var params = _action$payload.params;
                        var opts = _action$payload.opts;

                        router.navigate(name, params, opts);
                    } else if (action.type === CANCEL_TRANSITION) {
                        router.cancel();
                    }

                    return next(action);
                };
            };
        };
    };

    exports.router5Middleware = router5ReduxMiddleware;
    exports.router5Reducer = router5Reducer;
    exports.actions = actions;
    exports.actionTypes = actionTypes;
    exports.routeNodeSelector = routeNodeSelector;

});