[![npm version](https://badge.fury.io/js/react-router5.svg)](https://badge.fury.io/js/react-router5)
[![Build Status](https://travis-ci.org/router5/react-router5.svg?branch=master)](https://travis-ci.org/router5/react-router5)

# react-router5

> Higher-order components and components for React when using [router5](https://github.com/router5/router5).


### Installation

```sh
npm install --save react-router5
```

### Examples

* [Example project](https://github.com/router5/examples/tree/master/apps/react)
* [Demo](https://router5.github.io/docs/with-react.html#/inbox)

### Requirements

- react >= __0.14.0__
- router5 >= __2.0.0__

### What does this package export?

- `RouterProvider`: component
- `Link`: component
- `routeNode`: higher-order component
- `BaseLink`: component
- `withRoute`: higher-order component


### How it works

![With React](https://cdn.rawgit.com/router5/router5.github.io/master/img/router-view.png)


### RouterProvider

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

### routeNode HOC

__routeNode(nodeName)__: higher-order component to wrap a route node component.

- Specify your component node name (`''` if root node)

__Note:__ your router needs to use `listenersPlugin` from `router5`.

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

__The `Link `component is `BaseLink` and `withRoute` composed together__

### BaseLink component

Same as `Link`, except it won't mark it-self dirty (and re-render) on a route change. `BaseLink` needs to be passed your router instance.

### withRoute HOC

Will create a new component, injecting your router instance (from context) and the current route to the wrapped component. Any route change will trigger a re-render.

### Contributing

Please read [contributing guidelines](https://github.com/router5/router5/blob/master/CONTRIBUTING.md) on router5 repository.
