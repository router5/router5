import * as actions from './actions'
import { PluginFactory } from 'router5'

function reduxPluginFactory(dispatch): PluginFactory {
    function reduxPlugin() {
        return {
            onTransitionStart(toState, fromState) {
                dispatch(actions.transitionStart(toState, fromState))
            },
            onTransitionSuccess(toState, fromState) {
                dispatch(actions.transitionSuccess(toState, fromState))
            },
            onTransitionError(toState, fromState, err) {
                dispatch(actions.transitionError(toState, fromState, err))
            }
        }
    }

    reduxPlugin.pluginName = 'REDUX_PLUGIN'

    return reduxPlugin
}

export default reduxPluginFactory
