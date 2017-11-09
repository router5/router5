import createRouter, { loggerPlugin } from 'router5'
import browserPlugin from 'router5/plugins/browser'
import linkInterceptorPlugin from '../cycle/router5/link-interceptor-plugin'

const configureRouter = routes => {
    return createRouter(routes, {
        defaultRoute: 'a'
    })
        .usePlugin(loggerPlugin)
        .usePlugin(
            browserPlugin({
                useHash: true
            })
        )
        .usePlugin(linkInterceptorPlugin())
}

export default configureRouter
