'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var routerPlugin = function routerPlugin(dispatch) {
    return function () {
        return {
            name: 'REDUX_PLUGIN',
            onTransitionStart: function onTransitionStart(toState, fromState) {
                dispatch(actions.transitionStart(toState, fromState));
            },
            onTransitionSuccess: function onTransitionSuccess(toState, fromState) {
                dispatch(actions.transitionSuccess(toState, fromState));
            },
            onTransitionError: function onTransitionError(toState, fromState, err) {
                dispatch(actions.transitionError(toState, fromState, err));
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
                switch (action.type) {
                    case actionTypes.NAVIGATE_TO:
                        var _action$payload = action.payload;
                        var name = _action$payload.name;
                        var params = _action$payload.params;
                        var opts = _action$payload.opts;

                        router.navigate(name, params, opts);
                        break;

                    case actionTypes.CANCEL_TRANSITION:
                        router.cancel();
                        break;

                    case actionTypes.CAN_DEACTIVATE:
                        router.canDeactivate(action.payload.name, action.payload.canDeactivate);
                        break;

                    case actionTypes.CAN_ACTIVATE:
                        router.canActivate(action.payload.name, action.payload.canDeactivate);
                        break;

                    default:
                        return next(action);
                }
            };
        };
    };
};

exports.default = router5ReduxMiddleware;