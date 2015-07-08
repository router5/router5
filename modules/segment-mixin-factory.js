export default segmentMixinFactory

function segmentMixinFactory(router) {
    return (routeName, listener) => ({
        nodeListener(toState, fromState) {
            listener.call(this, toState, fromState)
        },

        componentDidMount() {
            if (listener) router.addNodeListener(routeName, this.nodeListener)
            router.registerComponent(routeName, this)
        },

        componentWillUnmount() {
            if (listener) router.removeNodeListener(routeName, this.nodeListener)
            router.deregisterComponent(routeName, this)
        }
    })
}
