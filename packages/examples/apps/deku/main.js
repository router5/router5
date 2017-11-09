import { tree, render } from 'deku'
import element from 'virtual-element'
import { routerPlugin } from 'deku-router5'
import App from './components/App'
import createRouter from '../create-router'

const router = createRouter(true)

const app = tree()
    .use(routerPlugin(router))
    .mount(element(App))

router.start(function(err, state) {
    render(app, document.getElementById('app'))
})
