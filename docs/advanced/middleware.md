# Middleware

Multiple middleware functions can be registered with a router instance. They are invoked in series after the router has made sure active
route segments can be deactivated and future active route segments can be activated. Middleware functions are for example a great way to load data for your routes.

## Registering middleware functions

A middleware is a function taking a router instance and registered dependencies (like lifecycle methods and plugins) and returning a function which will be called on each transition (unless a transition failed at the _canActivate_ or _canDeactivate_ state).

A middleware function can return a boolean for synchronous results, a promise or call
a done callback for asynchronous operations. If it returns false, a rejected promise or a callback with an error, it will fail the transition.

This type of function is ideal to remove data loading logic from components, and is a good fit
for applications aiming at having a centralised state object.

```javascript
const mware1 = (router) => (toState, fromState, done) => {
    // Let's fetch data and call done
    done();
};

const mware2 = (router) => (toState, fromState, done) => {
    // Let's fetch data and call done
    done();
};

router.useMiddleware(mware1, mware2);
```

`useMiddleware` can be called multiple times, but keep in mind that registration order matters. You can clear all your middleware functions by using `router.clearMiddleware()`.

## Adding data to state

It is possible to mutate the `toState` object by adding properties, or to pass a new state object in callbacks or promises.
When passing a new object, the router will ignore it if initial state properties (`name`, `params` and `path`) are changed.

```javascript
import { getData } from './dataApi';

const dataLoader = router =>
    (toState, fromState) =>
        // toState object will be extended with data values
        getData().then(data => ({ ...toState, ...data }));
```

## Custom errors

When failing a transition in a middleware function, custom errors can be returned. Custom errors can be a string or an object:
- when a string, the router will return ```{ code: 'TRANSITION_ERR', error: '<your string>'}```
- when an object, the returned error object will be extended with your error object ```{ code: 'TRANSITION_ERR', ...errorObject }```
