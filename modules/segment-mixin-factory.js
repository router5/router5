export default segmentMixinFactory

let segmentMixinFactory = (router) => {
    return (routeName, listener) => ({
        componentDidMount() {
            router.addNodeListener(routeName, listener.bind(this))
            router.registerComponent(routeName, this)
        },

        componentWillUnmount() {
            router.addremoveNodeListener(routeName, listener.bind(this))
            router.deregisterComponent(routeName, this)
        }
    })
})
