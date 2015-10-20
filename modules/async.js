export default function asyncProcess(isCancelled, functions, toState, fromState, callback, allowBool = true) {
    let remainingSteps = functions;

    const processFn = (done) => {
        if (!remainingSteps.length) return true;

        const len = remainingSteps[0].length;
        const res = remainingSteps[0](toState, fromState, done);

        if (allowBool && typeof res === 'boolean') {
            done(res ? null : true);
        } else if (res && typeof res.then === 'function') {
            res.then(() => done(null), () => done(true));
        }
        // else: wait for done to be called

        return false;
    };

    const iterate = (err) => {
        if (err) callback(err);
        else {
            remainingSteps = remainingSteps.slice(1);
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
