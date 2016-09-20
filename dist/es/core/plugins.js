var pluginMethods = ['onStart', 'onStop', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];

export default function withPlugins(router) {
    var plugins = [];
    var removePluginListeners = [];

    router.usePlugin = usePlugin;
    router.hasPlugin = hasPlugin;
    router.getPlugins = getPlugins;

    function getPlugins() {
        return plugins;
    }

    /**
     * Use plugins
     * @param  {...Function} plugins An argument list of plugins
     * @return {Object}              The router instance
     */
    function usePlugin() {
        for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
            plugins[_key] = arguments[_key];
        }

        plugins.forEach(addPlugin);
        return router;
    }

    function addPlugin(plugin) {
        if (!hasPlugin(plugin)) {
            plugins.push(plugin);
            startPlugin(plugin);
        }
    }

    /**
     * Check if a plugin has already been registered.
     * @param  {String}  pluginName The plugin name
     * @return {Boolean}            Whether the plugin has been registered
     */
    function hasPlugin(pluginName) {
        return plugins.filter(function (p) {
            return p.pluginName === pluginName || p.name === pluginName;
        }).length > 0;
    }

    function startPlugin(plugin) {
        var appliedPlugin = router.executeFactory(plugin);

        var removeEventListeners = pluginMethods.map(function (methodName) {
            if (appliedPlugin[methodName]) {
                return router.addEventListener(methodName.toLowerCase().replace(/^on/, '$$').replace(/transition/, '$$'), appliedPlugin[methodName]);
            }
        }).filter(Boolean);

        removePluginListeners.push.apply(removePluginListeners, babelHelpers.toConsumableArray(removeEventListeners));
    }
}