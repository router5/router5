import * as actions from './actions';

function reduxPluginFactory(dispatch) {
    function reduxPlugin() {
        return {
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

    reduxPlugin.pluginName = 'REDUX_PLUGIN';

    return reduxPlugin;
}

export default reduxPluginFactory;