import createRouter from 'router5'
import browserPlugin from 'router5/plugins/browser'
import routes from './routes'

export default function configureRouter() {
    const router = createRouter(routes, {
        defaultRoute: 'inbox'
    })
        // Plugins
        .usePlugin(
            browserPlugin({
                useHash: true
            })
        )

    return router
}
