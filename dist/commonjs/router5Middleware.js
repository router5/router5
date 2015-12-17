'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = replaceRoutesMiddleware;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _actionTypes = require('./actionTypes');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function routerPlugin(dispatch) {
    var plugin = {
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

    return plugin;
}

function replaceRoutesMiddleware(router) {
    return function (store) {
        var dispatch = store.dispatch;

        router.setAdditionalArgs(store);
        router.usePlugin(routerPlugin(dispatch));

        return function (next) {
            return function (action) {
                if (action.type === _actionTypes2['default'].NAVIGATE_TO) {
                    router.navigate(action.name, action.params, action.options);
                } else if (action.type === _actionTypes2['default'].CANCEL_TRANSITION) {
                    router.cancel();
                }

                return next(action);
            };
        };
    };
}

module.exports = exports['default'];