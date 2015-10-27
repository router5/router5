# react-router5

> High-order components and components for React when using [router5](https://github.com/router5/router5).

This package replaces `router5-react` which is deprecated.

### Example

Code here: [https://github.com/router5/examples/tree/master/apps/react](https://github.com/router5/examples/tree/master/apps/react)
Demo here: [http://localhost:8080/docs/with-react.html#/inbox](http://localhost:8080/docs/with-react.html#/inbox)

### Requirements

- react >= __0.14.0__
- router5 >= __1.0.0__


### RouterProvider HOC

It will add your router instance in context.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router5';
import App from './App';
import router from './router';

ReactDOM.render(
    <RouterProvider router={ router }><App /></RouterProvider>,
    document.getElementById('app')
);
```

### RouteNode HOC

__routeNode(nodeName, registerComponent = false)__: high-order component to wrap a route node component.

- Specify your component node name (`''` if root node)
- If you set `registerComponent` to true, you cannot use functional stateless components as `routeNode` make uses of _refs_.

__Note:__ your router needs to use `router5-listeners` plugin.

```javascript
import React from 'react';
import { routeNode } from 'react-router5';
import { UserView, UserList, NotFound } from './components';

function Users(props) {
    const { previousRoute, route } from props;

    switch (route.name) {
        case 'users.list':
            return <UserList/>;
        case 'users.view':
            return <UserView/>;
        default:
            return <NotFound/>;
    };
}

export default routeNode('users')(Users);

```

### Link component

```javascript
import React from 'react';
import { Link } from 'react-router5';

function Menu(props) {
    return (
        <nav>
            <Link routeName='home' routeOptions={{reload: true}}>Home</Link>

            <Link routeName='about' routeOptions={{reload: true}}>About</Link>
        </nav>
    );
}

export default Menu;
```


### Contributing

Please read [contributing guidelines](https://github.com/router5/router5/blob/master/CONTRIBUTING.md) on router5 repository.
