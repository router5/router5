# Errors and redirecting

When failing a transition function (canActivate, canDeactivate, middleware) custom errors can be returned. Custom errors can be a string or an object and will be added to the error object and passed to `start` and `navigate` callbacks).


## Custom errors

Custom errors can be a string (error code) or an object. They can be passed using the first argument of `done` callbacks or encapsulated in failed promises.

### A string

```js
router.canActivate('profile', (router) => (toState, fromState, done) => {
    done('my custom error');
});

router.navigate('profile', (err, state) => {
    /* Error:
    {
        code: 'CANNOT_ACTIVATE',
        segment: 'profile',
        error: 'my custom error'
    }
    /*
})
```

### An object

```js
router.canActivate('profile', (router) => (toState, fromState, done) => {
    done({
        why: 'because'
    });
});

router.navigate('profile', (err, state) => {
    /* Error:
    {
        code: 'CANNOT_ACTIVATE',
        segment: 'profile',
        why: 'because'
    }
    */
})
```

## Redirecting after an error

When you fail a transition, you can pass a `redirect` property to specify what the router should do next. `redirect` must be an object containing the route name you want to redirect to (`name`) and optionally can contain params (`params`).

```js
router.canActivate('profile', (router) => (toState, fromState, done) => {
    return isUserLoggedIn()
        .catch(() => Promise.reject({ redirect: { name: 'login' }}));
});

router.navigate('profile', (err, state) => {
    // err is null
    state.name === 'login';
});
```
