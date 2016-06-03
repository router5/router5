'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initialState = {
    route: null,
    previousRoute: null,
    transitionRoute: null,
    transitionError: null
};

function router5Reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case actionTypes.TRANSITION_START:
            return _extends({}, state, {
                transitionRoute: action.payload.route,
                transitionError: null
            });

        case actionTypes.TRANSITION_SUCCESS:
            return _extends({}, state, {
                transitionRoute: null,
                transitionError: null,
                previousRoute: action.payload.previousRoute,
                route: action.payload.route
            });

        case actionTypes.TRANSITION_ERROR:
            return _extends({}, state, {
                transitionRoute: action.payload.route,
                transitionError: action.payload.transitionError
            });

        case actionTypes.CLEAR_ERRORS:
            return _extends({}, state, {
                transitionRoute: null,
                transitionError: null
            });

        default:
            return state;
    }
}

exports.default = router5Reducer;