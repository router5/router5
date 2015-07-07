define(["exports", "module"], function (exports, module) {
    "use strict";

    module.exports = segmentMixinFactory;

    function segmentMixin(router) {
        return function (routeName, listener) {
            return {
                nodeListener: function nodeListener() {
                    listener.call(this);
                },

                componentDidMount: function componentDidMount() {
                    router.addNodeListener(routeName, this.nodeListener);
                    router.registerComponent(routeName, this);
                },

                componentWillUnmount: function componentWillUnmount() {
                    router.addremoveNodeListener(routeName, this.nodeListener);
                    router.deregisterComponent(routeName, this);
                }
            };
        };
    }
});