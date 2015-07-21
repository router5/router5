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
        global.async = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    module.exports = asyncProcess;

    function asyncProcess(functions, toState, fromState, callback) {
        var allowNoResult = arguments[4] === undefined ? false : arguments[4];

        var remainingSteps = functions || [];

        var processFn = function processFn(done) {
            if (!remainingSteps.length) return true;

            var len = remainingSteps[0].length;
            var res = remainingSteps[0](toState, fromState, done);

            if (typeof res === 'boolean') done(!res, res);else if (res && typeof res.then === 'function') {
                res.then(function () {
                    return done(null, true);
                }, function () {
                    return done(true, null);
                });
            } else if (len < 3 && allowNoResult) done(null, true);

            return false;
        };

        var iterate = function iterate(err, res) {
            if (err) callback(err);else {
                remainingSteps = remainingSteps.slice(1);
                next();
            }
        };

        var next = function next() {
            var finished = processFn(iterate);
            if (finished) callback(null, true);
        };

        next();
    }
});