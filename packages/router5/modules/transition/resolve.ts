export default function resolve(
    functions,
    { isCancelled, toState, fromState, errorKey = undefined },
    callback
) {
    let remainingFunctions = Array.isArray(functions)
        ? functions
        : Object.keys(functions)

    const isState = obj =>
        typeof obj === 'object' &&
        obj.name !== undefined &&
        obj.params !== undefined &&
        obj.path !== undefined
    const hasStateChanged = (toState, fromState) =>
        fromState.name !== toState.name ||
        fromState.params !== toState.params ||
        fromState.path !== toState.path

    const mergeStates = (toState, fromState) => ({
        ...fromState,
        ...toState,
        meta: {
            ...fromState.meta,
            ...toState.meta
        }
    })

    const processFn = (stepFn, errBase, state, _done) => {
        const done = (err, newState?) => {
            if (err) {
                _done(err)
            } else if (newState && newState !== state && isState(newState)) {
                if (hasStateChanged(newState, state)) {
                    console.error(
                        '[router5][transition] Warning: state values (name, params, path) were changed during transition process.'
                    )
                }

                _done(null, mergeStates(newState, state))
            } else {
                _done(null, state)
            }
        }
        const res = stepFn.call(null, state, fromState, done)
        if (isCancelled()) {
            done(null)
        } else if (typeof res === 'boolean') {
            done(res ? null : errBase)
        } else if (isState(res)) {
            done(null, res)
        } else if (res && typeof res.then === 'function') {
            res.then(
                resVal => {
                    if (resVal instanceof Error) done({ error: resVal }, null)
                    else done(null, resVal)
                },
                err => {
                    if (err instanceof Error) {
                        console.error(err.stack || err)
                        done({ ...errBase, promiseError: err }, null)
                    } else {
                        done(
                            typeof err === 'object'
                                ? { ...errBase, ...err }
                                : errBase,
                            null
                        )
                    }
                }
            )
        }
        // else: wait for done to be called
    }

    const next = (err, state) => {
        if (isCancelled()) {
            callback()
        } else if (err) {
            callback(err)
        } else {
            if (!remainingFunctions.length) {
                callback(null, state)
            } else {
                const isMapped = typeof remainingFunctions[0] === 'string'
                const errBase =
                    errorKey && isMapped
                        ? { [errorKey]: remainingFunctions[0] }
                        : {}
                const stepFn = isMapped
                    ? functions[remainingFunctions[0]]
                    : remainingFunctions[0]

                remainingFunctions = remainingFunctions.slice(1)

                processFn(stepFn, errBase, state, next)
            }
        }
    }

    next(null, toState)
}
