import createRouter, { loggerPlugin } from 'router5'
import browserPlugin from 'router5/plugins/browser'

const configureRouter = routes => {
    return createRouter(routes, {
        defaultRoute: 'inbox'
    })
        .usePlugin(loggerPlugin)
        .usePlugin(
            browserPlugin({
                useHash: true
            })
        )
}

export default configureRouter
