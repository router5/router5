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

module.exports = exports['default'];