define(["exports", "module"], function (exports, module) {
    "use strict";

    module.exports = segmentMixinFactory;

    function segmentMixinFactory(router) {
        return function (routeName, listener) {
            return {
                nodeListener: function nodeListener(toState, fromState) {
                    listener.call(this, toState, fromState);
                },

                componentDidMount: function componentDidMount() {
                    if (listener) router.addNodeListener(routeName, this.nodeListener);
                    router.registerComponent(routeName, this);
                },

                componentWillUnmount: function componentWillUnmount() {
                    if (listener) router.removeNodeListener(routeName, this.nodeListener);
                    router.deregisterComponent(routeName, this);
                }
            };
        };
    }
});