[![npm version](https://badge.fury.io/js/react-router5.svg)](https://badge.fury.io/js/react-router5)

# react-router5


## Demos and examples

* Higher-order components: [https://stackblitz.com/edit/react-router5-new-context-api](https://stackblitz.com/edit/react-router5)
* New context API: [https://stackblitz.com/edit/react-router5-new-context-api](https://stackblitz.com/edit/react-router5-new-context-api)


## Installation

Install module `react-router5:

```sh
yarn add react-router5
# or
npm install --save react-router5
```

## Higher-order components

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
* **withRouter**: HoC injecting your router instance only (from context) to the wrapped component.

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

## Link components

* **Link**: a component to render hyperlinks. For a full list of supported props, check the source! `Link` is `withRoute` and `Link` composed together
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

## New React context API

For using the new React context API, you need React version 16.3 or above.

> Three new components have been published to leverage React's new context API. Those components won't replace existing ones: instead `react-router5` will keep offering higher-order components and components accepting render functions.

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
