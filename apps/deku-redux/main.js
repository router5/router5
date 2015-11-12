import { tree, render } from 'deku';
import element from 'virtual-element';
import { storePlugin } from 'deku-redux';
import { routerPlugin } from 'deku-router5';
import App from './components/App';
import createRouter from './create-router'
import configureStore from './store';

const router = createRouter();

router.start((err, state) => {
    const store = configureStore(router, { router: { route: state }});

    const app = tree()
        .use(storePlugin(store))
        .set('router', router)
        .mount(element(App));

    render(app, document.getElementById('app'));
});
