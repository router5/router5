export default segmentMixinFactory

let segmentMixinFactory = (router) => {
    return (routeName, listener) => ({
        nodeListener() {
            listener.call(this)
        },

        componentDidMount() {
            router.addNodeListener(routeName, this.nodeListener)
            router.registerComponent(routeName, this)
        },

        componentWillUnmount() {
            router.addremoveNodeListener(routeName, this.nodeListener)
            router.deregisterComponent(routeName, this)
        }
    })
}
