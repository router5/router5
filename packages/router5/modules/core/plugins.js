const pluginMethods = [
    'onStart',
    'onStop',
    'onTransitionSuccess',
    'onTransitionStart',
    'onTransitionError',
    'onTransitionCancel'
]

export default function withPlugins(router) {
    const plugins = []
    let removePluginListeners = []

    router.usePlugin = usePlugin
    router.hasPlugin = hasPlugin
    router.getPlugins = getPlugins

    function getPlugins() {
        return plugins
    }

    /**
     * Use plugins
     * @param  {...Function} plugins An argument list of plugins
     * @return {Object}              The router instance
     */
    function usePlugin(...plugins) {
        plugins.forEach(addPlugin)
        return router
    }

    function addPlugin(plugin) {
        if (!hasPlugin(plugin)) {
            plugins.push(plugin)
            startPlugin(plugin)
        }
    }

    /**
     * Check if a plugin has already been registered.
     * @param  {String}  pluginName The plugin name
     * @return {Boolean}            Whether the plugin has been registered
     */
    function hasPlugin(pluginName) {
        return (
            plugins.filter(
                p => p.pluginName === pluginName || p.name === pluginName
            ).length > 0
        )
    }

    function startPlugin(plugin) {
        const appliedPlugin = router.executeFactory(plugin)

        const removeEventListeners = pluginMethods
            .map(methodName => {
                if (appliedPlugin[methodName]) {
                    return router.addEventListener(
                        methodName
                            .toLowerCase()
                            .replace(/^on/, '$$')
                            .replace(/transition/, '$$'),
                        appliedPlugin[methodName]
                    )
                }
            })
            .filter(Boolean)

        removePluginListeners.push(...removeEventListeners)
    }
}
