'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.navigateTo = navigateTo;
exports.cancelTransition = cancelTransition;
exports.clearErrors = clearErrors;
exports.transitionStart = transitionStart;
exports.transitionSuccess = transitionSuccess;
exports.transitionError = transitionError;

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function navigateTo(name) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return {
        type: actionTypes.NAVIGATE_TO,
        payload: {
            name: name,
            params: params,
            opts: opts
        }
    };
}

function cancelTransition() {
    return {
        type: actionTypes.CANCEL_TRANSITION
    };
}

function clearErrors() {
    return {
        type: actionTypes.CLEAR_ERRORS
    };
}

function transitionStart(route, previousRoute) {
    return {
        type: actionTypes.TRANSITION_START,
        payload: {
            route: route,
            previousRoute: previousRoute
        }
    };
}

function transitionSuccess(route, previousRoute) {
    return {
        type: actionTypes.TRANSITION_SUCCESS,
        payload: {
            route: route,
            previousRoute: previousRoute
        }
    };
}

function transitionError(route, previousRoute, transitionError) {
    return {
        type: actionTypes.TRANSITION_ERROR,
        payload: {
            route: route,
            previousRoute: previousRoute,
            transitionError: transitionError
        }
    };
}