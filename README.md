[![npm version](https://badge.fury.io/js/router5.svg)](http://badge.fury.io/js/router5)
[![Build Status](https://travis-ci.org/router5/router5.svg)](https://travis-ci.org/router5/router5)
[![Join the chat at https://gitter.im/router5/router5](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/router5/router5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Official website: [router5.github.io](http://router5.github.io)

# router5

router5 is a **framework and view library agnostic router**.

* **view / state separation**: router5 processes routing **instructions** and outputs **state** updates.
* **universal**: works client-side and server-side
* **simple**: define your routes, start to listen to route changes
* **flexible**: you have control over transitions and what happens on transitions

```js
import createRouter from 'router5'
import browserPlugin from 'router5/plugins/browser'

const routes = [
    { name: 'home', path: '/' },
    { name: 'profile', path: '/profile' }
]

const router = createRouter(routes)
    .usePlugin(browserPlugin())

router.start()
```

**With React (new context API)**

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { RouteProvider, Route } from 'react-router5'

function App({ route }) {
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
    <RouteProvider router={router}>
        <Route>{({ route }) => <App route={route} />}</Route>
    </RouteProvider>,
    document.getElementById('root')
)
```

**With observables**

Your router instance is compatible with most observable libraries.

```js
import { from } from 'rxjs/observable/from'

from(router).map(({ route }) => {
    /* happy routing */
})
```


### Guides

[!["Past and future of client-side routing" @ ReactiveConf 2016](https://cloud.githubusercontent.com/assets/1777517/21482220/e9889d74-cb68-11e6-8077-ea2b3c9d6fb1.png)](https://www.youtube.com/watch?v=hblXdstrAg0)

* [Configuring routes](http://router5.github.io/docs/configuring-routes.html)
* [Router options](http://router5.github.io/docs/router-options.html)
* [Path syntax](http://router5.github.io/docs/path-syntax.html)
* [Navigation](http://router5.github.io/docs/navigation.html)
* [Preventing navigation](http://router5.github.io/docs/preventing-navigation.html)
* [Custom errors and redirections](http://router5.github.io/docs/custom-errors.html)
* [Middleware functions](http://router5.github.io/docs/middleware.html)
* [Transition](http://router5.github.io/docs/transition.html)
* [Using plugins](http://router5.github.io/docs/plugins.html)
* [Universal applications](http://router5.github.io/docs/universal-applications.html)
* [Async data](http://router5.github.io/docs/async-data.html)

### Integrations

* [react-router5](./packages/react-router5)
* [redux-router5](./packages/redux-router5)

### API

* [API Reference](http://router5.github.io/docs/api-reference.html)
