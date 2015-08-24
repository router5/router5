export default function asyncProcess(isCancelled, functions, toState, fromState, callback, allowNoResult = false) {
    isCancelled = isCancelled || (() => false)
    let remainingSteps = functions || []

    let processFn = (done) => {
        if (!remainingSteps.length) return true

        let len = remainingSteps[0].length
        let res = remainingSteps[0](toState, fromState, done)

        if (typeof res === 'boolean') {
            done(res ? null : true);
        } else if (res && typeof res.then === 'function') {
            res.then(() => done(null), () => done(true))
        } else if (len < 3 && allowNoResult) {
            done(null)
        }

        return false
    }

    let iterate = (err) => {
        if (err) callback(err)
        else {
            remainingSteps = remainingSteps.slice(1)
            next()
        }
    }

    let next = () => {
        if (isCancelled()) {
            callback(null)
        } else {
            let finished = processFn(iterate)
            if (finished) callback(null)
        }
    }

    next()
}
