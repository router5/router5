[![npm version](https://badge.fury.io/js/react-router5.svg)](https://badge.fury.io/js/react-router5)

# react-router5

> Higher-order components and components for React when using [router5](https://github.com/router5/router5).

### Installation

```sh
npm install --save react-router5
```

### Examples

* [Example project](../examples/apps/react)
* [Demo](https://router5.github.io/docs/with-react.html#/inbox)

### Requirements

* react >= **0.14.0**
* router5 >= **2.0.0**

### What does this package export?

* `RouterProvider`: component
* `Link`: component
* `routeNode`: higher-order component
* `BaseLink`: component
* `withRoute`: higher-order component

### How it works

![With React](https://cdn.rawgit.com/router5/router5.github.io/master/img/router-view.png)

### Available components

* **RouterProvider**: adds your router instance in context.

```javascript
const AppWithRouter = (
    <RouterProvider router={router}>
        <App />
    </RouterProvider>
)
```

* **withRoute(BaseComponent)**: HoC injecting your router instance (from context) and the current route to the wrapped component. Any route change will trigger a re-render
* **routeNode(nodeName)(BaseComponent)**: like above, expect it only re-renders when the given route node is the transition node. When using `routeNode` components, make sure to key the ones which can render the same components but with different route params.

```javascript
import React from 'react'
import { routeNode } from 'react-router5'
import { UserView, UserList, NotFound } from './components'

function Users(props) {
    const { previousRoute, route } = props

    switch (route.name) {
        case 'users.list':
            return <UserList />
        case 'users.view':
            return <UserView />
        default:
            return <NotFound />
    }
}

export default routeNode('users')(Users)
```

**The `Link`component is `BaseLink` and `withRoute` composed together**

* **Link**: a component to render hyperlinks. For a full list of supported props, check the source!
* **BaseLink**: same as `Link`, except it won't re-render on a route change.

```javascript
import React from 'react'
import { Link } from 'react-router5'

function Menu(props) {
    return (
        <nav>
            <Link routeName="home">Home</Link>

            <Link routeName="about">About</Link>
        </nav>
    )
}

export default Menu
```

### New React context components (React >= 16.3.0)

Three new components have been published to leverage React's new context API. Those components are still in development and won't replace existing ones: instead `react-router5` will offer higher-order components and components acception render functions.

* `RouteProvider`
* `Route`
* `RouteNode`

Both `Route` and `RouteNode` pass to their chilren an object containing `route`, `previousRoute` and `router`.

```js
const App = (
    <RouteProvider router={router}>
        <RouteNode nodeName="">
            {({ route, previousRoute, router }) => <div>Route</div>}
        </RouteNode>
    </RouteProvider>
)
```
