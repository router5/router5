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
        ROUTER_NOT_STARTED: 0,
        SAME_STATES: 1,
        CANNOT_DEACTIVATE: 2,
        CANNOT_ACTIVATE: 3,
        NODE_LISTENER_ERR: 4,
        TRANSITION_CANCELLED: 5
    };

    module.exports = constants;
});