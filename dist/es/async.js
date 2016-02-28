export default function asyncProcess(functions, _ref, callback) {
    var isCancelled = _ref.isCancelled;
    var toState = _ref.toState;
    var fromState = _ref.fromState;
    var additionalArgs = _ref.additionalArgs;
    var errorKey = _ref.errorKey;

    var remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

    var isState = function isState(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj)) === 'object' && obj.name !== undefined && obj.params !== undefined && obj.path !== undefined;
    };
    var hasStateChanged = function hasStateChanged(state) {
        return state.name !== toState.name || state.params !== toState.params || state.path !== toState.path;
    };

    var processFn = function processFn(done) {
        if (!remainingFunctions.length) return true;

        var isMapped = typeof remainingFunctions[0] === 'string';
        var errBase = errorKey && isMapped ? babelHelpers.defineProperty({}, errorKey, remainingFunctions[0]) : {};
        var stepFn = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];

        // const len = stepFn.length;
        var res = stepFn.apply(null, additionalArgs.concat([toState, fromState, done]));

        if (isCancelled()) {
            done(null);
        } else if (typeof res === 'boolean') {
            done(res ? null : errBase);
        } else if (res && typeof res.then === 'function') {
            res.then(function (resVal) {
                if (resVal instanceof Error) done({ error: resVal }, null);else done(null, resVal);
            }, function (err) {
                if (err instanceof Error) {
                    console.error(err.stack || err);
                    done(babelHelpers.extends({}, errBase, { promiseError: err }), null);
                } else {
                    done((typeof err === 'undefined' ? 'undefined' : babelHelpers.typeof(err)) === 'object' ? babelHelpers.extends({}, errBase, err) : errBase, null);
                }
            });
        }
        // else: wait for done to be called

        return false;
    };

    var iterate = function iterate(err, val) {
        if (err) callback(err);else {
            if (val && isState(val)) {
                if (hasStateChanged(val)) console.error('[router5][transition] State values changed during transition process and ignored.');else toState = val;
            }
            remainingFunctions = remainingFunctions.slice(1);
            next();
        }
    };

    var next = function next() {
        if (isCancelled()) {
            callback(null);
        } else {
            var finished = processFn(iterate);
            if (finished) callback(null, toState);
        }
    };

    next();
}