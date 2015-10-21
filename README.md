# react-router5

High-order components and components for React when using [router5](https://github.com/router5/router5).

This package replaces `router5-react` which is deprecated.

### Requirements

- react >= 0.14.0
- router5 >= 1.0.0


### Router HOC

It will add your router instance in context.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router5';
import App from './App';
import router from './router';

ReactDOM.render(
    <Router router={ router }><App /></Router>,
    document.getElementById('app')
);
```

### RouteNode HOC

High-order component to wrap a route node component.

__Note:__ your router needs to use `router5-listeners` plugin.

```javascript
import React from 'react';
import { routeNode } from 'react-router5';
import { Home, About, NotFound } from './components';

export default RootNode;

function RootNode(props) {
    const { previousRoute, route } from props;

    switch (route.name) {
        case 'home':
            return <Home/>;
        case 'about':
            return <About/>;
        default:
            return <NotFound/>;
    };
}

```

### Link component

```javascript
import React from 'react';
import { Link } from 'react-router5';

export default Menu;

function Menu(props) {
    return (
        <nav>
            <Link routeName='home' routeOptions={{reload: true}}>Home</Link>

            <Link routeName='about' routeOptions={{reload: true}}>About</Link>
        </nav>
    );
}
```


### Contributing

Please read [contributing guidelines](https://github.com/router5/router5/blob/master/CONTRIBUTING.md) on router5 repository.
