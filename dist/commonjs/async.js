Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = asyncProcess;

function asyncProcess(isCancelled, functions, toState, fromState, callback) {
    var allowBool = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];

    var remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

    var processFn = function processFn(done) {
        if (!remainingFunctions.length) return true;

        var isMapped = typeof remainingFunctions[0] === 'string';
        var errVal = isMapped ? remainingFunctions[0] : true;
        var stepFn = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];

        var len = stepFn.length;
        var res = stepFn(toState, fromState, done);

        if (allowBool && typeof res === 'boolean') {
            done(res ? null : errVal);
        } else if (res && typeof res.then === 'function') {
            res.then(function () {
                return done(null);
            }, function () {
                return done(errVal);
            });
        }
        // else: wait for done to be called

        return false;
    };

    var iterate = function iterate(err) {
        if (err) callback(err);else {
            remainingFunctions = remainingFunctions.slice(1);
            next();
        }
    };

    var next = function next() {
        if (isCancelled()) {
            callback(null);
        } else {
            var finished = processFn(iterate);
            if (finished) callback(null);
        }
    };

    next();
}

module.exports = exports['default'];