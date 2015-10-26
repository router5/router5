'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.navigateTo = navigateTo;
exports.cancelTransition = cancelTransition;
exports.clearErrors = clearErrors;
exports.transitionStart = transitionStart;
exports.transitionSuccess = transitionSuccess;
exports.transitionError = transitionError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _actionTypes = require('./actionTypes');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

function navigateTo(name) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return {
        type: _actionTypes2['default'].NAVIGATE_TO,
        name: name,
        params: params,
        opts: opts
    };
}

function cancelTransition() {
    return {
        type: _actionTypes2['default'].CANCEL_TRANSITION
    };
}

function clearErrors() {
    return {
        type: _actionTypes2['default'].CLEAR_ERRORS
    };
}

function transitionStart(route, previousRoute) {
    return {
        type: _actionTypes2['default'].TRANSITION_START,
        route: route,
        previousRoute: previousRoute
    };
}

function transitionSuccess(route, previousRoute) {
    return {
        type: _actionTypes2['default'].TRANSITION_SUCCESS,
        route: route,
        previousRoute: previousRoute
    };
}

function transitionError(route, previousRoute, transitionError) {
    return {
        type: _actionTypes2['default'].TRANSITION_ERROR,
        route: route,
        previousRoute: previousRoute,
        transitionError: transitionError
    };
}