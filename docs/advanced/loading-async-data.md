# Loading async data

Loading async data is always an important task of a web application. Very often, data and routes are tied to your application business logic. Therefore, loading data on a route change is very common.

The way data loading can work with routing depends on what you might call your "routing strategy":

* Do you want a route transition to wait for data to be loaded?
* Do you want a route transition to fail if data cannot be loaded?
* How do you bind your view to data?

There are many ways to handle data coming from a router and from an API:

* your components can receive them both at the same time
* your components can receive a route update first and then a data update later
* your components can receive a route update first and decide to load data
* etc...

Router5 doesn't provide an opinionated way of handling async data, instead this article demonstrates the tools router5 can provide to help you loading data. You shouldn't view those examples as _the_ way to load data, their purpose is purely illustrative and they don't cover every case \(error handling, server-side data loading, etc...\). Instead you should aim to do things and organise your code the way you think is best for you and your application.

## Using a middleware

> You can use your router state objects as a container for route-specific data.

You can use a middleware if you want your router to wait for data updates and/or prevent a route transition to happen if data loading fails. When doing so, you can use `toState` state object as a container for your route-specific data: your router will emit the mutated state.

First, we need to define what data need to be loaded for which route segment:

```javascript
const routes = [
    {
        name: 'home',
        path: '/home'
    },
    {
        name: 'users',
        path: '/users',
        onActivate: (params) => fetch('/users').then(data => ({ users: data.users }))
    },
    {
        name: 'users.user',
        path: '/:id',
        onActivate: (params) => fetch(`/users/${params.id}`).then(data => ({ user: data.user }))
    }
]
```

Then we create a middleware function which will invoke data for the activated segments on a route change. In this example, data are loaded in parallel using `Promise.all`. You can proceed differently by loading data in series, or by implementing dependencies between your `onActivate` handlers.

```javascript
import transitionPath from 'router5-transition-path';

const dataMiddlewareFactory = (routes) => (router) => (toState, fromState) => {
    const { toActivate } = transitionPath(toState, fromState);
    const onActivateHandlers =
        toActivate
            .map(segment => routes.find(r => r.name === segment).onActivate)
            .filter(Boolean)

    return Promise
        .all(onActivateHandlers.map(callback => callback()))
        .then(data => {
            const routeData = data.reduce((accData, rData) => Object.assign(accData, rData), {});
            return { ...toState, data: routeData };
        });
};
```

And when configuring your router:

```javascript
import { routes } from './routes';

const router = createRouter(routes);
/* ... configure your router */

/* data middleware */
router.useMiddleware(dataMiddlewareFactory(routes));
```

In the case you don't want a route transition to wait for data to be loaded, you cannot use the router state object as a data container. Instead, you should load data from your components or use a state container like [redux](https://redux.js.org).

## Using a state container \(redux\)

> Using a state container like redux gives you a lot more flexibility with your routing strategy.

Using a state container like redux gives you a lot more flexibility with your routing strategy. Because all data ends up in the same bucket that your components can listen to, data loading doesn't need to block route transitions. The only thing it needs is a reference to your store so actions can be dispatched. As a result, your view can represent with greater details the state of your application: for example your UI can be a lot more explicit about displaying loading feedback. Not blocking route transitions also means immediate URL updates \(history\), making your app feel more responsive.

The following example assumes the use a redux store configured with a `redux-thunk` middleware.

```javascript
import { loadUsers, loadUser } from './actionCreators';

const routes = [
    {
        name: 'home',
        path: '/home'
    },
    {
        name: 'users',
        path: '/users',
        onActivate: (params) => (dispatch) =>
            fetch('/users').then(data => dispatch(loadUsers(data.users)))
    },
    {
        name: 'users.user',
        path: '/:id',
        onActivate: (params) => (dispatch) =>
            fetch(`/users/${params.id}`).then(data => dispatch(loadUser(data.user)))
    }
]
```

You need to create your store and router, and pass your store to your router instance \(with `.setDependency()`\):

```javascript
router.setDependency('store', store);
```

Then we create a router5 middleware for data which will load data on a transition success.

```javascript
import { actionTypes } from 'redux-router5';
import transitionPath from 'router5-transition-path';

const onRouteActivateMiddleware = (routes) => (router, dependencies) => (toState, fromState, done) => {
    const { toActivate } = transitionPath(toState, fromState);

    toActivate.forEach(segment => {
        const routeSegment = routes.find(r => r.name === segment);

        if (routeSegment && routeSegment.onActivate) {
            dependencies.store.dispatch(routeSegment.onActivate(toState.params));
        }
    });

    done();
};
```

Finally, just create your store and include `onRouteActivateMiddleware(routes)` middleware.

## Async data loading and universal applications

The two examples above show two different techniques of loading data with a router5 middleware. One is blocking, one is non-blocking. But what about universal applications?

The answer is very simple: block on the server-side, and choose to block or not on the client-side! For the example with example, you would need dispatch to return promises \(with redux-thunk, your thunks need to return promises for their async operations\).

## Chunk loading

Chunk loading \(loading code asynchronoulsy\) is similar to data loading, since one can consider code is a form of data. With middlewares, you can call a done callback or return a promise, making them perfectly usable with `require.ensure` or `System.import`. Like examples above, you can implement similar techniques with, let's say, a `loadComponent` route property.

```javascript
const routes = {
        name: 'users',
        path: '/users',
        onActivate: (params) => (dispatch) =>
            fetch('/users').then(data => dispatch(loadUsers(data.users))),
        loadComponent: () => import('./views/UsersList')
    },
};
```

Then what you need is a middleware triggering `loadComponent`.

There are also emerging techniques of anticipated loading rather than lazy loading \(i.e. from a specific view / component, chunks are loaded in anticipation of where a user is likely to go next\). We could implement a `relatedComponents` property.

```javascript
const routes = [
    {
        name: 'home',
        path: '/home',
        loadComponent: () => import('./views/Home'),
        relatedComponents: [ 'users' ]
    },
    {
        name: 'users',
        path: '/users',
        onActivate: (params) => (dispatch) =>
            fetch('/users').then(data => dispatch(loadUsers(data.users))),
        loadComponent: () => import('./views/UsersList'),
        relatedComponents: [ 'home' ]
    },
};
```

Then on a transition, what you might want to consider this strategy:

* Load data and component \(chunk\)
* Once done, request idle callback to start loading sibling components

