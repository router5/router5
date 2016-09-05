'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

exports.default = reduxPluginFactory;