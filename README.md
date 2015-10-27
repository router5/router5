# redux-router5

> Router5 integration with redux. If you develop with React, use this package with __[react-redux](https://github.com/rackt/react-redux)__
and __[react-router5](https://github.com/router5/react-router5)__.

__[Example](https://github.com/router5/examples/tree/master/apps/react-redux)__ | __[Demo](http://router5.github.io/docs/with-react-redux.html)__

Using router5 with redux removes the need to include _router5-listeners_.

## How to use

- Create and configure your router instance
- Create and configure your store including `router5Middleware` and `router5Reducer`
- Use `routeNodeSelector` on route nodes in your component tree
- Use provided actions to perform routing


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

Under the hood, it simply add a plugin to your router instance so your router
dispatch actions on transition start, error, success and cancel. It also relay
`navigateTo` actions to the router.


## router5Reducer

A simple reducer which is added by `router5Middleware`. It will manage a piece of your state with the following data attributes:

- route
- previousRoute
- transitionRoute (the current transitioning route)
- transitionError


## Actions

Available actions

- __navigateTo(routeName, routeParams = {}, routeOptions = {})__
- __cancelTransition()__
- __clearErrors()__

```javascript
import { actions } from 'redux-router5';
```

## routeNodeSelector

`routeNodeSelector` is a selector created with [reselect](https://github.com/rackt/reselect). It is designed to be used on a route node
and works with `connect` higher-order component from `react-redux`.

```javascript
import { connect } from 'react-redux';
import { routeNodeSelector } from 'redux-router5';
import { Home, About, Contact, Admin, NotFound } from './components';

function Root({ route }) {
    const { params, name } = route;

    switch (name) {
        case 'home':
            return <Home params={ params } />
        case 'about':
            return <About params={ params } />
        case 'contact':
            return <Contact params={ params } />
        case 'admin':
            return <Admin params={ params } />
        default:
            return <NotFound />
    }
}

export default connect(routeNodeSelector('')(Root));
```
