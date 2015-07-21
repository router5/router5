export default function asyncProcess(functions, toState, fromState, callback, allowNoResult = false) {
    let remainingSteps = functions || []

    let processFn = (done) => {
        if (!remainingSteps.length) return true

        let len = remainingSteps[0].length
        let res = remainingSteps[0](toState, fromState, done)

        if (typeof res === 'boolean') done(!res, res);

        else if (res && typeof res.then === 'function') {
            res.then(() => done(null, true), () => done(true, null))
        }

        else if (len < 3 && allowNoResult) done(null, true)

        return false
    }

    let iterate = (err, res) => {
        if (err) callback(err)
        else {
            remainingSteps = remainingSteps.slice(1)
            next()
        }
    }

    let next = () => {
        let finished = processFn(iterate)
        if (finished) callback(null, true)
    }

    next()
}
