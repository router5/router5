import * as actionTypes from './actionTypes';
import reduxPlugin from './reduxPlugin';

var router5ReduxMiddleware = function router5ReduxMiddleware(router) {
    return function (store) {
        var dispatch = store.dispatch;

        router.setDependency('store', store);
        router.usePlugin(reduxPlugin(dispatch));

        return function (next) {
            return function (action) {
                switch (action.type) {
                    case actionTypes.NAVIGATE_TO:
                        var _action$payload = action.payload,
                            name = _action$payload.name,
                            params = _action$payload.params,
                            opts = _action$payload.opts;

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

export default router5ReduxMiddleware;