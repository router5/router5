import * as actionTypes from './actionTypes';
import * as actions from './actions';

const routerPlugin = dispatch =>
    () => ({
        name: 'REDUX_PLUGIN',
        onTransitionStart(toState, fromState) {
            dispatch(actions.transitionStart(toState, fromState));
        },
        onTransitionSuccess(toState, fromState) {
            dispatch(actions.transitionSuccess(toState, fromState));
        },
        onTransitionError(toState, fromState, err) {
            dispatch(actions.transitionError(toState, fromState, err));
        }
    });

const router5ReduxMiddleware = router =>
    store => {
        const { dispatch } = store;
        router.usePlugin(routerPlugin(dispatch));

        return next => action => {
            switch(action.type) {
                case actionTypes.NAVIGATE_TO:
                    const { name, params, opts } = action.payload;
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

export default router5ReduxMiddleware;
