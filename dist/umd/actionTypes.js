(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.actionTypes = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    var actionTypes = {
        NAVIGATE_TO: 'R5_NAVIGATE',
        CANCEL_TRANSITION: 'R5_CANCEL',
        TRANSITION_ERROR: 'R5_TRANSITION_ERROR',
        TRANSITION_SUCCESS: 'R5_TRANSITION_SUCCESS',
        TRANSITION_START: 'R5_TRANSITION_START',
        CLEAR_ERRORS: 'R5_CLEAR_ERRORS'
    };

    module.exports = actionTypes;
});