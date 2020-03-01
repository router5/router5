# Router5

[![npm version](https://badge.fury.io/js/router5.svg)](http://badge.fury.io/js/router5)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/router5/router5.svg)](https://travis-ci.org/router5/router5) [![Join the chat at https://gitter.im/router5/router5](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/router5/router5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Official website: [router5.js.org](https://router5.js.org)

router5 is a **framework and view library agnostic router**.

- **view / state separation**: router5 processes routing **instructions** and outputs **state** updates.
- **universal**: works client-side and server-side
- **simple**: define your routes, start to listen to route changes
- **flexible**: you have control over transitions and what happens on transitions

```javascript
import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'

const routes = [
  { name: 'home', path: '/' },
  { name: 'profile', path: '/profile' }
]

const router = createRouter(routes)

router.usePlugin(browserPlugin())

router.start()
```

**With React \(hooks\)**

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { RouterProvider, useRoute } from 'react-router5'

function App() {
  const { route } = useRoute()

  if (!route) {
    return null
  }

  if (route.name === 'home') {
    return <h1>Home</h1>
  }

  if (route.name === 'profile') {
    return <h1>Profile</h1>
  }
}

ReactDOM.render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>,
  document.getElementById('root')
)
```

**With observables**

Your router instance is compatible with most observable libraries.

```javascript
import { from } from 'rxjs/observable/from'

from(router).map(({ route }) => {
  /* happy routing */
})
```

### Examples

- With React: [`code`](./examples/react) | [`live`](https://codesandbox.io/s/github/router5/router5/tree/master/examples/react)

### Docs

- Introduction
  - [Why router5?](https://router5.js.org/introduction/why-router5)
  - [Getting Started](https://router5.js.org/introduction/getting-started)
  - [Ecosystem](https://router5.js.org/introduction/ecosystem)
  - [Core concepts](https://router5.js.org/introduction/core-concepts)
  - [Transition phase](https://router5.js.org/introduction/transition-phase)
- Guides
  - [Defining routes](https://router5.js.org/guides/defining-routes)
  - [Path Syntax](https://router5.js.org/guides/path-syntax)
  - [Router options](https://router5.js.org/guides/router-options)
  - [Navigating](https://router5.js.org/guides/navigating)
  - [In the browser](https://router5.js.org/guides/in-the-browser)
  - [Observing state](https://router5.js.org/guides/observing-state)
- Integration
  - [With React](https://router5.js.org/integration/with-react)
  - [With Redux](https://router5.js.org/integration/with-redux)
- Advanced
  - [Plugins](https://router5.js.org/advanced/plugins)
  - [Middleware](https://router5.js.org/advanced/middleware)
  - [Preventing navigation](https://router5.js.org/advanced/preventing-navigation)
  - [Errors and redirections](https://router5.js.org/advanced/errors-and-redirections)
  - [Dependency injection](https://router5.js.org/advanced/dependency-injection)
  - [Loading async data](https://router5.js.org/advanced/loading-async-data)
  - [Universal routing](https://router5.js.org/advanced/universal-routing)
  - [Listeners plugin](https://router5.js.org/advanced/listeners-plugin)
- [API Reference](https://router5.js.org/api-reference)
