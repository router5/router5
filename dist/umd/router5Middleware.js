(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './actionTypes', './actions'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./actionTypes'), require('./actions'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.actionTypes, global.actions);
        global.router5Middleware = mod.exports;
    }
})(this, function (exports, module, _actionTypes, _actions) {
    'use strict';

    module.exports = replaceRoutesMiddleware;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _actionTypes2 = _interopRequireDefault(_actionTypes);

    function routerPlugin(dispatch) {
        var plugin = {
            name: 'REDUX_PLUGIN',
            onTransitionStart: function onTransitionStart(toState, fromState) {
                dispatch(_actions.transitionStart(toState, fromState));
            },
            onTransitionSuccess: function onTransitionSuccess(toState, fromState) {
                dispatch(_actions.transitionSuccess(toState, fromState));
            },
            onTransitionError: function onTransitionError(toState, fromState, err) {
                dispatch(_actions.transitionError(toState, fromState, err));
            }
        };

        return plugin;
    }

    function replaceRoutesMiddleware(router) {
        return function (_ref) {
            var dispatch = _ref.dispatch;

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
});