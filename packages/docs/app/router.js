import { createRouter } from 'router5'
import browserPlugin from 'router5/plugins/browser'
import listenersPlugin from 'router5/plugins/listeners'

export default function createAppRouter() {
    return createRouter([
        {
            name: 'home',
            path: '/'
        },
        {
            name: 'gettingStarted',
            path: '/getting-started'
        }
    ]).usePlugin(listenersPlugin(), browserPlugin())
}
