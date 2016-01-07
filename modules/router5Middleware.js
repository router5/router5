import actionTypes from './actionTypes';
import * as actions from './actions';

function routerPlugin(dispatch) {
    const plugin = {
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
    };

    return plugin;
}

export default function replaceRoutesMiddleware(router) {
    return store => {
        const { dispatch } = store;
        router.setAdditionalArgs(store);
        router.usePlugin(routerPlugin(dispatch));


        return next => action => {
            if (action.type === actionTypes.NAVIGATE_TO) {
                router.navigate(action.name, action.params, action.opts);
            } else if (action.type === actionTypes.CANCEL_TRANSITION) {
                router.cancel();
            }

            return next(action);
        };
    };
}
