# deku-router5

> High-order components and components for Deku when using [router5](../packages/router5).

This package replaces `router5-deku` which is deprecated.


### Requirements

- deku >= __0.5.0__
- router5 >= __2.0.0__

### routerPlugin

It will add your router instance in context.

```javascript
import { tree, render } from 'deku';
import element from 'virtual-element';
import { routerPlugin } from 'deku-router5';
import App from './App';
import router from './router';

const myApp = tree()
    .use(routerPlugin(router))
    .mount(element(App));

render(myApp, document.getElementById('app'));
```

### RouteNode HOC

__routeNode(nodeName)__: high-order component to wrap a route node component.

__Note:__ your router needs to use `router5-listeners` plugin.

```javascript
import element from 'virtual-element';
import { routeNode } from 'deku-router5';
import { UserView, UserList, NotFound } from './components';

const Users = {
    render(props) {
        const { previousRoute, route } from props;

        switch (route.name) {
            case 'users.list':
                return element(UserList);
            case 'users.view':
                return element(UserView);
            default:
                return element(NotFound);
        };
    }
};

export default routeNode('users')(Users);

```

### Link component

```javascript
import element from 'virtual-element';
import { Link } from 'deku-router5';

const Menu = {
    render(props) {
        return element('nav', {}, [
            element(Link, { routeName: 'home', routeOptions: { reload: true } }, 'Home'),
            element(Link, { routeName: 'about', routeOptions: { reload: true } }, 'About')
        ]);
    }
}

export default Menu;
```
