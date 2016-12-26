import transitionPath from 'router5.transition-path';

var defaultOptions = {
    autoCleanUp: true
};

function listenersPluginFactory() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;

    function listenersPlugin(router) {
        var listeners = {};

        function removeListener(name, cb) {
            if (cb) {
                if (listeners[name]) listeners[name] = listeners[name].filter(function (callback) {
                    return callback !== cb;
                });
            } else {
                listeners[name] = [];
            }
            return router;
        };

        function addListener(name, cb, replace) {
            var normalizedName = name.replace(/^(\*|\^|=)/, '');

            if (normalizedName && !/^\$/.test(name)) {
                var segments = router.rootNode.getSegmentsByName(normalizedName);
                if (!segments) console.warn('No route found for ' + normalizedName + ', listener might never be called!');
            }

            if (!listeners[name]) listeners[name] = [];
            listeners[name] = (replace ? [] : listeners[name]).concat(cb);

            return router;
        };

        router.getListeners = function () {
            return listeners;
        };

        router.addListener = function (cb) {
            return addListener('*', cb);
        };
        router.removeListener = function (cb) {
            return removeListener('*', cb);
        };

        router.addNodeListener = function (name, cb) {
            return addListener('^' + name, cb, true);
        };
        router.removeNodeListener = function (name, cb) {
            return removeListener('^' + name, cb);
        };

        router.addRouteListener = function (name, cb) {
            return addListener('=' + name, cb);
        };
        router.removeRouteListener = function (name, cb) {
            return removeListener('=' + name, cb);
        };

        function invokeListeners(name, toState, fromState) {
            (listeners[name] || []).forEach(function (cb) {
                if (listeners[name].indexOf(cb) !== -1) {
                    cb(toState, fromState);
                }
            });
        }

        function onTransitionSuccess(toState, fromState, opts) {
            var _transitionPath = transitionPath(toState, fromState),
                intersection = _transitionPath.intersection,
                toDeactivate = _transitionPath.toDeactivate;

            var intersectionNode = opts.reload ? '' : intersection;
            var name = toState.name;


            if (options.autoCleanUp) {
                toDeactivate.forEach(function (name) {
                    return removeListener('^' + name);
                });
            }

            invokeListeners('^' + intersectionNode, toState, fromState);
            invokeListeners('=' + name, toState, fromState);
            invokeListeners('*', toState, fromState);
        }

        return { onTransitionSuccess: onTransitionSuccess };
    };

    listenersPlugin.pluginName = 'LISTENERS_PLUGIN';

    return listenersPlugin;
}

export default listenersPluginFactory;