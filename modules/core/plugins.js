const pluginMethods = ['onStart', 'onStop', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];

export default function withPlugins(router) {
    const plugins = [];
    let removePluginListeners = [];

    router.usePlugin = usePlugin;
    router.hasPlugin = hasPlugin;

    function usePlugin(...plugins) {
        plugins.forEach(addPlugin);
        return router;
    }

    function addPlugin(plugin) {
        if (!hasPlugin(plugin)) {
            plugins.push(plugin);
            startPlugin(plugin);
        }
    }

    function hasPlugin(pluginName) {
        return plugins.filter(p => p.name === pluginName).length > 0;
    }

    function startPlugin(plugin) {
        const appliedPlugin = router.executeFactory(plugin);

        const removeEventListeners = pluginMethods.map((methodName) => {
            if (appliedPlugin[methodName]) {
                return router.addEventListener(
                    methodName.toLowerCase().replace(/^on/, '$$').replace(/transition/, '$$'),
                    appliedPlugin[methodName]
                );
            }
        }).filter(Boolean);

        removePluginListeners.push(...removeEventListeners);
    }
}
