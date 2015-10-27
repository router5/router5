import { tree, render } from 'deku';
import element from 'virtual-element';
import { routerPlugin } from 'deku-router5';
import App from './components/App';
import router from './router';

router.start(function (err, state) {
    const app = tree()
        .use(routerPlugin(router))
        .mount(element(App));

    render(app, document.getElementById('app'));
});
