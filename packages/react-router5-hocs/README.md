[![npm version](https://badge.fury.io/js/react-router5-hocs.svg)](https://badge.fury.io/js/react-router5-hocs)

# react-router5-hocs

This package is the old `react-router5` package: it contains components using React old context API.

For React the new context API (HoCs, hooks and render props), see [react-router5](../react-router5)

## Installation

Install module `react-router5-hocs:

```sh
yarn add react-router5-hocs
# or
npm install --save react-router5-hocs
```

## Higher-order components

-   **RouterProvider**: adds your router instance in context.

```javascript
const AppWithRouter = (
    <RouterProvider router={router}>
        <App />
    </RouterProvider>
)
```

-   **withRoute(BaseComponent)**: HoC injecting your router instance (from context) and the current route to the wrapped component. Any route change will trigger a re-render
-   **routeNode(nodeName)(BaseComponent)**: like above, expect it only re-renders when the given route node is the transition node. When using `routeNode` components, make sure to key the ones which can render the same components but with different route params.
-   **withRouter**: HoC injecting your router instance only (from context) to the wrapped component.

```javascript
import React from 'react'
import { routeNode } from 'react-router5-hocs'
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

-   **Link**: a component to render hyperlinks. For a full list of supported props, check the source! `Link` is `withRoute` and `Link` composed together
-   **BaseLink**: same as `Link`, except it won't re-render on a route change.

```javascript
import React from 'react'
import { Link } from 'react-router5-hocs'

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
