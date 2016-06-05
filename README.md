[![npm version](https://badge.fury.io/js/redux-router5.svg)](https://badge.fury.io/js/redux-router5)
[![Build Status](https://travis-ci.org/router5/redux-router5.svg?branch=master)](https://travis-ci.org/router5/redux-router5)

# redux-router5

> Router5 integration with redux. If you develop with React, use this package with __[react-redux](https://github.com/rackt/react-redux)__
and __[react-router5](https://github.com/router5/react-router5)__. Using router5 with redux removes the need to include _router5-listeners_.

__[Example](https://github.com/router5/examples/tree/master/apps/react-redux)__ | __[Demo](http://router5.github.io/docs/with-react-redux.html)__ | __[Learn router5](http://router5.github.io)__

## Requirements

- __router5 >= 4.0.0__
- __redux >= 3.0.0__

## How to use

- Create and configure your router instance
- Create and configure your store including `router5Middleware` and `router5Reducer`
- Use `routeNodeSelector` on route nodes in your component tree
- Use provided actions to perform routing
- Since __router5@1.1.0__, `canActivate` and `canDeactivate` functions take `store` as their first argument

### How it works

![With redux](https://github.com/router5/router5.github.io/blob/master/img/router-redux.png)

__Breaking change from 4.x__: the middleware doesn't pass the store to your router instance (using `.inject()`). If you want to use your store in `canActivate`, `canDeactivate`, middlewares and plugins, use `router.inject(store)`.

### Middleware is optional

The sole purpose of the redux middleware `router5Middleware` is to translate actions to router instructions (`navigate`, `cancel`, `canActivate` and `canDeactivate`. __You may not need it__: for instance, if you use React and have your router instance in context, you can call `router.navigate()` directly.

### With React

```javascript
import { ReactDOM } from 'react-dom';
import { RouterProvider } from 'react-router5';
import { Provider } from 'react-redux';
import React from 'react';
import App from './app';
import createRouter from './create-router';
import configureStore from './store';

const router = createRouter();
const store = configureStore(router);

router.start(() => {
    ReactDOM.render(
        (
            <Provider store={ store }>
                <RouterProvider router={ router }>
                    <App />
                </RouterProvider> 
            </Provider>
        ),
        document.getElementById('app')
    );
});
```

__Note:__ `RouterProvider` comes from `react-router5`. It simply adds your router instance in your application context, which is required. Alternatively, you can use `withContext()` from [recompose](https://github.com/acdlite/recompose). __You also may not need it__: having your router in context gives you access router methods like `buildUrl`, `isActive`, etc... If you don't use those methods, then you don't need your router instance in context.


## router5Middleware

```javascript
import createRouter from './create-router';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { router5Middleware, router5Reducer } from 'redux-router5';

function configureStore(router, initialState = {}) {
    const createStoreWithMiddleware = applyMiddleware(router5Middleware(router))(createStore);

    const store = createStoreWithMiddleware(combineReducers({
        router: router5Reducer,
        /* your reducers */
    }), initialState);

    return store;
}

const router = createRouter();
const store = configureStore(router, { router: { route: state }});

router.start();
```

Under the hood, it simply adds a plugin to your router instance so your router
dispatches actions on transition start, error, success and cancel (You can read more about router5 plugins [here](http://router5.github.io/docs/plugins.html)).
It also relay `navigateTo` actions to the router.


## router5Reducer

A simple reducer which is added by `router5Middleware`. __Note:__  use `router` for your reducer key name, other names are not yet supported.
`router5Reducer` will manage a piece of your state containing the following data attributes:

- route
- previousRoute
- transitionRoute (the current transitioning route)
- transitionError (the last error which occured)

`route` and `previousRoute` have a `name`, `params` and `path` properties.

## Actions

Available actions (you can use your router instance directly instead)

- __navigateTo(routeName, routeParams = {}, routeOptions = {})__
- __cancelTransition()__
- __clearErrors()__
- __canActivate(routeName, true | false)__
- __canDeactivate(routeName, true | false)__

```javascript
import { actions } from 'redux-router5';
```

## routeNodeSelector

`routeNodeSelector` is a selector created with [reselect](https://github.com/rackt/reselect). It is designed to be used on a route node
and works with `connect` higher-order component from `react-redux`.

If your routes are nested, you'll have a few route nodes in your application. On each route change, only _one_ route node needs to be re-rendered.
That route node is the highest common node between your previous route and your current route. `routeNodeSelector` will only trigger a re-render
when it needs to.

Then it is just a matter of returning the right component depending on the current route. Your virtual tree will react to route changes, all of that
by simply __leveraging the power of connect and reselect__!

[router5.helpers](https://github.com/router5/helpers) provides
a set of functions to help making those decisions (useful if you have nested routes).

```javascript
import { connect } from 'react-redux';
import { routeNodeSelector } from 'redux-router5';
import { Home, About, Contact, Admin, NotFound } from './components';
import { startsWithSegment } from 'router5.helpers';

function Root({ route }) {
    const { params, name } = route;

    const testRoute = startsWithSegment(name);

    if (testRoute('home')) {
        return <Home params={ params } />;
    } else if (testRoute('about')) {
        return <About params={ params } />;
    } else if (testRoute('contact')) {
        return <Contact params={ params } />;
    } else if (testRoute('admin')) {
        return <Admin params={ params } />;
    } else {
        return <NotFound />;
    }
}

export default connect(routeNodeSelector(''))(Root);
```
