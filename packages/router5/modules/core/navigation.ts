import { constants, errorCodes } from '../constants'
import { Router } from '../types/router'
import transition from '../transition'

const noop = () => {}

export default function withNavigation<Dependencies>(
    router: Router<Dependencies>
): Router<Dependencies> {
    let cancelCurrentTransition

    router.navigate = navigate
    router.navigate = navigate

    router.navigateToDefault = (...args) => {
        const opts = typeof args[0] === 'object' ? args[0] : {}
        const done =
            args.length === 2
                ? args[1]
                : typeof args[0] === 'function'
                ? args[0]
                : noop
        const options = router.getOptions()

        if (options.defaultRoute) {
            return navigate(
                options.defaultRoute,
                options.defaultParams,
                opts,
                done
            )
        }

        return () => {}
    }

    router.cancel = () => {
        if (cancelCurrentTransition) {
            cancelCurrentTransition('navigate')
            cancelCurrentTransition = null
        }

        return router
    }

    function navigate(...args) {
        const name = args[0]
        const lastArg = args[args.length - 1]
        const done = typeof lastArg === 'function' ? lastArg : noop
        const params = typeof args[1] === 'object' ? args[1] : {}
        const opts = typeof args[2] === 'object' ? args[2] : {}

        if (!router.isStarted()) {
            done({ code: errorCodes.ROUTER_NOT_STARTED })
            return
        }

        const route = router.buildState(name, params)

        if (!route) {
            const err = { code: errorCodes.ROUTE_NOT_FOUND }
            done(err)
            router.invokeEventListeners(
                constants.TRANSITION_ERROR,
                null,
                router.getState(),
                err
            )
            return
        }

        const toState = router.makeState(
            route.name,
            route.params,
            router.buildPath(route.name, route.params),
            { params: route.meta, options: opts }
        )
        const sameStates = router.getState()
            ? router.areStatesEqual(router.getState(), toState, false)
            : false

        // Do not proceed further if states are the same and no reload
        // (no deactivation and no callbacks)
        if (sameStates && !opts.reload && !opts.force) {
            const err = { code: errorCodes.SAME_STATES }
            done(err)
            router.invokeEventListeners(
                constants.TRANSITION_ERROR,
                toState,
                router.getState(),
                err
            )
            return
        }

        const fromState = router.getState()

        if (opts.skipTransition) {
            done(null, toState)
            return noop
        }

        // Transition
        return router.transitionToState(
            toState,
            fromState,
            opts,
            (err, state) => {
                if (err) {
                    if (err.redirect) {
                        const { name, params } = err.redirect

                        navigate(
                            name,
                            params,
                            { ...opts, force: true, redirected: true },
                            done
                        )
                    } else {
                        done(err)
                    }
                } else {
                    router.invokeEventListeners(
                        constants.TRANSITION_SUCCESS,
                        state,
                        fromState,
                        opts
                    )
                    done(null, state)
                }
            }
        )
    }

    router.transitionToState = (
        toState,
        fromState,
        options = {},
        done = noop
    ) => {
        router.cancel()
        router.invokeEventListeners(
            constants.TRANSITION_START,
            toState,
            fromState
        )

        cancelCurrentTransition = transition(
            router,
            toState,
            fromState,
            options,
            (err, state) => {
                cancelCurrentTransition = null
                state = state || toState

                if (err) {
                    if (err.code === errorCodes.TRANSITION_CANCELLED) {
                        router.invokeEventListeners(
                            constants.TRANSITION_CANCEL,
                            toState,
                            fromState
                        )
                    } else {
                        router.invokeEventListeners(
                            constants.TRANSITION_ERROR,
                            toState,
                            fromState,
                            err
                        )
                    }
                    done(err)
                } else {
                    router.setState(state)
                    done(null, state)
                }
            }
        )

        return cancelCurrentTransition
    }

    return router
}
