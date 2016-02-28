import * as actionTypes from './actionTypes';
import * as actions from './actions';

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
                if (action.type === actionTypes.NAVIGATE_TO) {
                    var _action$payload = action.payload;
                    var name = _action$payload.name;
                    var params = _action$payload.params;
                    var opts = _action$payload.opts;

                    router.navigate(name, params, opts);
                } else if (action.type === actionTypes.CANCEL_TRANSITION) {
                    router.cancel();
                }

                return next(action);
            };
        };
    };
};

export default router5ReduxMiddleware;