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
        SAME_STATES: 2,
        CANNOT_DEACTIVATE: 3,
        CANNOT_ACTIVATE: 4,
        NODE_LISTENER_ERR: 5,
        TRANSITION_CANCELLED: 6
    };

    module.exports = constants;
});