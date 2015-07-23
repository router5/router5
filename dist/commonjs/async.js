'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = asyncProcess;

function asyncProcess(functions, toState, fromState, callback) {
    var allowNoResult = arguments[4] === undefined ? false : arguments[4];

    var remainingSteps = functions || [];

    var processFn = function processFn(done) {
        if (!remainingSteps.length) return true;

        var len = remainingSteps[0].length;
        var res = remainingSteps[0](toState, fromState, done);

        if (typeof res === 'boolean') done(res ? null : true);else if (res && typeof res.then === 'function') {
            res.then(function () {
                return done(null);
            }, function () {
                return done(true);
            });
        } else if (len < 3 && allowNoResult) done(null);

        return false;
    };

    var iterate = function iterate(err) {
        if (err) callback(err);else {
            remainingSteps = remainingSteps.slice(1);
            next();
        }
    };

    var next = function next() {
        var finished = processFn(iterate);
        if (finished) callback(null);
    };

    next();
}

module.exports = exports['default'];