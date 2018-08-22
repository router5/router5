import createRouter from 'router5'
import loggerPlugin from 'router5/plugins/logger'
import browserPlugin from 'router5/plugins/browser'
import routes from './routes'

export default function configureRouter() {
    const router = createRouter(routes, {
        defaultRoute: 'inbox'
    })
        // Plugins
        .usePlugin(loggerPlugin)
        .usePlugin(
            browserPlugin({
                useHash: true
            })
        )

    return router
}
