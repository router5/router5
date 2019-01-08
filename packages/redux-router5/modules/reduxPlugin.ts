import * as actions from './actions'
import { PluginFactory } from 'router5'

function reduxPluginFactory(dispatch): PluginFactory {
    return () => ({
        onTransitionStart(toState, fromState) {
            dispatch(actions.transitionStart(toState, fromState))
        },
        onTransitionSuccess(toState, fromState) {
            dispatch(actions.transitionSuccess(toState, fromState))
        },
        onTransitionError(toState, fromState, err) {
            dispatch(actions.transitionError(toState, fromState, err))
        }
    })
}

export default reduxPluginFactory
