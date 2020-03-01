# With React

## Installation

Install module `react-router5:

```sh
yarn add react-router5
# or
npm install --save react-router5
```

## Demos and examples

[https://stackblitz.com/edit/react-router5](https://stackblitz.com/edit/react-router5)

## Provider

-   **RouterProvider**: adds your router instance and router state in context.

```javascript
const AppWithRouter = (
    <RouterProvider router={router}>
        <App />
    </RouterProvider>
)
```

## Connecting components

You can connect your components using three different methods:

-   Higher-order components: `withRouter`, `withRoute` and `routeNode`
-   Render props: `Router`, `Route` and `RouteNode`
-   Hooks: `useRouter`, `useRoute` and `useRouteNode`

|                          | HoC          | Render prop | Hook           |
| ------------------------ | ------------ | ----------- | -------------- |
| Use your router instance | `withRouter` | `Router`    | `useRouter`    |
| Connect to routing state | `withRoute`  | `Route`     | `useRoute`     |
| Connect to a route node  | `routeNode`  | `RouteNode` | `useRouteNode` |

## Link components

-   **Link**: a component to render hyperlinks. For a full list of supported props, check the source! `Link` is `withRoute` and `Link` composed together
-   **ConnectedLink**: same as `Link`, except it re-renders on a route changes.

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
