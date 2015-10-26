(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './actionTypes'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./actionTypes'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.actionTypes);
        global.router5Reducer = mod.exports;
    }
})(this, function (exports, module, _actionTypes) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _actionTypes2 = _interopRequireDefault(_actionTypes);

    var initialState = {
        route: null,
        previousRoute: null,
        transitionRoute: null,
        transitionError: null
    };

    function router5Reducer(state, action) {
        if (state === undefined) state = initialState;

        switch (action.type) {
            case _actionTypes2['default'].TRANSTION_START:
                return _extends({}, state, {
                    transitionRoute: action.route,
                    transitionError: null
                });

            case _actionTypes2['default'].TRANSITION_SUCCESS:
                return _extends({}, state, {
                    transitionRoute: null,
                    transitionError: null,
                    previousRoute: action.previousRoute,
                    route: action.route
                });

            case _actionTypes2['default'].TRANSITION_ERROR:
                return _extends({}, state, {
                    transitionRoute: action.route,
                    transitionError: action.transitionError
                });

            case _actionTypes2['default'].CLEAR_ERRORS:
                return _extends({}, state, {
                    transitionRoute: null,
                    transitionError: null
                });

            default:
                return state;
        }
    }

    module.exports = router5Reducer;
});