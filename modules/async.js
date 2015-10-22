export default function asyncProcess(isCancelled, functions, toState, fromState, callback, allowBool = true) {
    let remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

    const processFn = (done) => {
        if (!remainingFunctions.length) return true;

        const isMapped = typeof remainingFunctions[0] === 'string';
        const errVal = isMapped ? remainingFunctions[0] : true;
        const stepFn  = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];

        const len = stepFn.length;
        const res = stepFn(toState, fromState, done);

        if (allowBool && typeof res === 'boolean') {
            done(res ? null : errVal);
        } else if (res && typeof res.then === 'function') {
            res.then(() => done(null), () => done(errVal));
        }
        // else: wait for done to be called

        return false;
    };

    const iterate = (err) => {
        if (err) callback(err);
        else {
            remainingFunctions = remainingFunctions.slice(1);
            next();
        }
    };

    const next = () => {
        if (isCancelled()) {
            callback(null);
        } else {
            const finished = processFn(iterate);
            if (finished) callback(null);
        }
    };

    next();
}
