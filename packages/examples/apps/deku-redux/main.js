import { tree, render } from 'deku'
import element from 'virtual-element'
import { storePlugin } from 'deku-redux'
import { routerPlugin } from 'deku-router5'
import App from './components/App'
import createRouter from '../create-router'
import configureStore from './store'

const router = createRouter()
const store = configureStore(router)

const app = tree()
    .use(storePlugin(store))
    .set('router', router)
    .mount(element(App))

router.start((err, state) => {
    render(app, document.getElementById('app'))
})
