import transitionPath, { nameToIDs } from 'router5-transition-path'
import resolve from './resolve'
import { constants, errorCodes } from '../constants'

export default function transition(router, toState, fromState, opts, callback) {
    let cancelled = false
    let completed = false
    const options = router.getOptions()
    const [
        canDeactivateFunctions,
        canActivateFunctions
    ] = router.getLifecycleFunctions()
    const middlewareFunctions = router.getMiddlewareFunctions()
    const isCancelled = () => cancelled
    const cancel = () => {
        if (!cancelled && !completed) {
            cancelled = true
            callback({ code: errorCodes.TRANSITION_CANCELLED }, null)
        }
    }
    const done = (err, state) => {
        completed = true

        if (isCancelled()) {
            return
        }

        if (!err && options.autoCleanUp) {
            const activeSegments = nameToIDs(toState.name)
            Object.keys(canDeactivateFunctions).forEach(name => {
                if (activeSegments.indexOf(name) === -1)
                    router.clearCanDeactivate(name)
            })
        }

        callback(err, state || toState)
    }
    const makeError = (base, err) => ({
        ...base,
        ...(err instanceof Object ? err : { error: err })
    })

    const isUnknownRoute = toState.name === constants.UNKNOWN_ROUTE
    const asyncBase = { isCancelled, toState, fromState }
    const { toDeactivate, toActivate } = transitionPath(toState, fromState)

    const canDeactivate =
        !fromState || opts.forceDeactivate
            ? []
            : (toState, fromState, cb) => {
                  let canDeactivateFunctionMap = toDeactivate
                      .filter(name => canDeactivateFunctions[name])
                      .reduce(
                          (fnMap, name) => ({
                              ...fnMap,
                              [name]: canDeactivateFunctions[name]
                          }),
                          {}
                      )

                  resolve(
                      canDeactivateFunctionMap,
                      { ...asyncBase, errorKey: 'segment' },
                      err =>
                          cb(
                              err
                                  ? makeError(
                                        { code: errorCodes.CANNOT_DEACTIVATE },
                                        err
                                    )
                                  : null
                          )
                  )
              }

    const canActivate = isUnknownRoute
        ? []
        : (toState, fromState, cb) => {
              const canActivateFunctionMap = toActivate
                  .filter(name => canActivateFunctions[name])
                  .reduce(
                      (fnMap, name) => ({
                          ...fnMap,
                          [name]: canActivateFunctions[name]
                      }),
                      {}
                  )

              resolve(
                  canActivateFunctionMap,
                  { ...asyncBase, errorKey: 'segment' },
                  err =>
                      cb(
                          err
                              ? makeError(
                                    { code: errorCodes.CANNOT_ACTIVATE },
                                    err
                                )
                              : null
                      )
              )
          }

    const middleware = !middlewareFunctions.length
        ? []
        : (toState, fromState, cb) =>
              resolve(middlewareFunctions, { ...asyncBase }, (err, state) =>
                  cb(
                      err
                          ? makeError({ code: errorCodes.TRANSITION_ERR }, err)
                          : null,
                      state || toState
                  )
              )

    const pipeline = []
        .concat(canDeactivate)
        .concat(canActivate)
        .concat(middleware)

    resolve(pipeline, asyncBase, done)

    return cancel
}
