import { constants, errorCodes } from '../constants'
import { Router } from '../types/router'

const noop = function() {}

export default function withRouterLifecycle<Dependencies>(
    router: Router<Dependencies>
): Router<Dependencies> {
    let started = false

    router.isStarted = () => started

    //@ts-ignore
    router.start = (...args) => {
        const options = router.getOptions()
        const lastArg = args[args.length - 1]
        const done = typeof lastArg === 'function' ? lastArg : noop
        const startPathOrState =
            typeof args[0] !== 'function' ? args[0] : undefined

        if (started) {
            done({ code: errorCodes.ROUTER_ALREADY_STARTED })
            return router
        }

        let startPath, startState

        started = true
        router.invokeEventListeners(constants.ROUTER_START)

        // callback
        const cb = (err, state?, invokeErrCb = true) => {
            if (!err)
                router.invokeEventListeners(
                    constants.TRANSITION_SUCCESS,
                    state,
                    null,
                    { replace: true }
                )
            if (err && invokeErrCb)
                router.invokeEventListeners(
                    constants.TRANSITION_ERROR,
                    state,
                    null,
                    err
                )
            done(err, state)
        }

        if (startPathOrState === undefined && !options.defaultRoute) {
            return cb({ code: errorCodes.NO_START_PATH_OR_STATE })
        }
        if (typeof startPathOrState === 'string') {
            startPath = startPathOrState
        } else if (typeof startPathOrState === 'object') {
            startState = startPathOrState
        }

        if (!startState) {
            // If no supplied start state, get start state
            startState =
                startPath === undefined ? null : router.matchPath(startPath)

            // Navigate to default function
            const navigateToDefault = () =>
                router.navigateToDefault({ replace: true }, done)
            const redirect = route =>
                router.navigate(
                    route.name,
                    route.params,
                    { replace: true, reload: true, redirected: true },
                    done
                )

            const transitionToState = state => {
                router.transitionToState(
                    state,
                    router.getState(),
                    {},
                    (err, state) => {
                        if (!err) cb(null, state)
                        else if (err.redirect) redirect(err.redirect)
                        else if (options.defaultRoute) navigateToDefault()
                        else cb(err, null, false)
                    }
                )
            }
            // If matched start path
            if (startState) {
                transitionToState(startState)
            } else if (options.defaultRoute) {
                // If default, navigate to default
                navigateToDefault()
            } else if (options.allowNotFound) {
                transitionToState(
                    router.makeNotFoundState(startPath, { replace: true })
                )
            } else {
                // No start match, no default => do nothing
                cb({ code: errorCodes.ROUTE_NOT_FOUND, path: startPath }, null)
            }
        } else {
            // Initialise router with provided start state
            router.setState(startState)
            cb(null, startState)
        }

        return router
    }

    router.stop = () => {
        if (started) {
            router.setState(null)
            started = false
            router.invokeEventListeners(constants.ROUTER_STOP)
        }

        return router
    }

    return router
}
