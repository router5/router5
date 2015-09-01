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
        global.constants = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    var constants = {
        ROUTER_NOT_STARTED: 'NOT_STARTED',
        ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
        ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
        SAME_STATES: 'SAME_STATES',
        CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
        CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
        TRANSITION_ERR: 'TRANSITION_ERR',
        NODE_LISTENER_ERR: 'NODE_ERR',
        TRANSITION_CANCELLED: 'CANCELLED'
    };

    module.exports = constants;
});