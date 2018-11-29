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

export default function withPlugins(router: Router): Router {
    const routerPlugins: PluginFactory[] = []
    let removePluginListeners = []

    router.getPlugins = () => routerPlugins

    router.usePlugin = (...plugins) => {
        plugins.forEach(plugin => {
            if (!router.hasPlugin(plugin.pluginName)) {
                routerPlugins.push(plugin)
                startPlugin(plugin)
            }
        })

        return router
    }

    router.hasPlugin = pluginName =>
        routerPlugins.filter(
            p => p.pluginName === pluginName || p.name === pluginName
        ).length > 0

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

        removePluginListeners.push(...removeEventListeners)
    }

    return router
}