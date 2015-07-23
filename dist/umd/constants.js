(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "module"], factory);
    } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.constants = mod.exports;
    }
})(this, function (exports, module) {
    "use strict";

    var constants = {
        ROUTER_NOT_STARTED: 1,
        ROUTER_ALREADY_STARTED: 2,
        SAME_STATES: 10,
        CANNOT_DEACTIVATE: 11,
        CANNOT_ACTIVATE: 12,
        NODE_LISTENER_ERR: 13,
        TRANSITION_CANCELLED: 20
    };

    module.exports = constants;
});