import { constants } from '../constants'
import { Router, PluginFactory } from '../types/router'

const eventsMap = {
    onStart: constants.ROUTER_START,
    onStop: constants.ROUTER_STOP,
    onTransitionSuccess: constants.TRANSITION_SUCCESS,
    onTransitionStart: constants.TRANSITION_START,
    onTransitionError: constants.TRANSITION_ERROR,
    onTransitionCancel: constants.TRANSITION_CANCEL
}

export default function withPlugins<Dependencies>(
    router: Router<Dependencies>
): Router<Dependencies> {
    let routerPlugins: PluginFactory[] = []

    router.getPlugins = () => routerPlugins

    router.usePlugin = (...plugins) => {
        const removePluginFns = plugins.map(plugin => {
            routerPlugins.push(plugin)
            return startPlugin(plugin)
        })

        return () => {
            routerPlugins = routerPlugins.filter(
                plugin => plugins.indexOf(plugin) === -1
            )
            removePluginFns.forEach(removePlugin => removePlugin())
        }
    }

    function startPlugin(plugin) {
        const appliedPlugin = router.executeFactory(plugin)

        const removeEventListeners = Object.keys(eventsMap)
            .map(methodName => {
                if (appliedPlugin[methodName]) {
                    return router.addEventListener(
                        eventsMap[methodName],
                        appliedPlugin[methodName]
                    )
                }
            })
            .filter(Boolean)

        return () => {
            removeEventListeners.forEach(removeListener => removeListener())
            if (appliedPlugin.teardown) {
                appliedPlugin.teardown()
            }
        }
    }

    return router
}
