import transitionPath from 'router5.transition-path';

const defaultOptions = {
    autoCleanUp: true
};

function listenersPluginFactory(options = defaultOptions) {
    return function listenersPlugin(router) {
        let listeners = {};

        function removeListener(name, cb) {
            if (cb) {
                if (listeners[name]) listeners[name] = listeners[name].filter(callback => callback !== cb);
            } else {
                listeners[name] = [];
            }
            return router;
        };

        function addListener(name, cb, replace) {
            const normalizedName = name.replace(/^(\*|\^|=)/, '');

            if (normalizedName && !/^\$/.test(name)) {
                const segments = router.rootNode.getSegmentsByName(normalizedName);
                if (!segments) console.warn(`No route found for ${normalizedName}, listener might never be called!`);
            }

            if (!listeners[name]) listeners[name] = [];
            listeners[name] = (replace ? [] : listeners[name]).concat(cb);

            return router;
        };

        router.getListeners = () => listeners;

        router.addListener = (cb) => addListener('*', cb);
        router.removeListener = (cb) => removeListener('*', cb);

        router.addNodeListener    = (name, cb) => addListener('^' + name, cb, true);
        router.removeNodeListener = (name, cb) => removeListener('^' + name, cb);

        router.addRouteListener = (name, cb) => addListener('=' + name, cb);
        router.removeRouteListener = (name, cb) => removeListener('=' + name, cb);

        function invokeListeners(name, toState, fromState) {
            (listeners[name] || []).forEach(cb => cb(toState, fromState));
        }

        function onTransitionSuccess(toState, fromState, opts) {
            const {intersection, toDeactivate} = transitionPath(toState, fromState);
            const intersectionNode = opts.reload ? '' : intersection;
            const { name } = toState;

            if (options.autoCleanUp) {
                toDeactivate.forEach(name => removeListener('^' + name));
            }

            invokeListeners('^' + intersectionNode, toState, fromState);
            invokeListeners('=' + name, toState, fromState);
            invokeListeners('*', toState, fromState);
        }

        return { onTransitionSuccess };
    };
}

export default listenersPluginFactory;
