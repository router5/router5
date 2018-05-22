# Navigating

After configuring your routes, you need to enable navigation by starting your router instance.

## Starting your router

```javascript
const myRouter = createRouter([
    { name: 'home', path: '/home' },
    { name: 'about', path: '/about' },
    { name: 'contact', path: '/contact' }
]);

myRouter.start('/home');
```

> When using `.start()`, you should supply a starting path or state except if you use the browser plugin \(the current URL will automatically be used\).

Invoking the `.start(startPathOrState[, done])` function will:

* Attempt to navigate to `startPathOrState`
* Attempt to match the current URL if no `startPathOrState` was provided, or navigation failed
* Attempt to navigate to the default route if it could not match the provided start path or if `startPathOrState` was not provided / failed

And will:

* Enable navigation

Providing a starting state is designed to be used for universal JavaScript applications: see [universal applications](https://github.com/router5/router5/tree/1cc1c6969a96918deb28e45b8c5b2d6aa19d0a19/docs/guides/universal-applications.md).

## Defining a default route

A default route can be set in `createRouter` options. The following example will cause your application to navigate to `/about`:

```javascript
var myRouter = createRouter([
        { name: 'home', path: '/home' },
        { name: 'section', path: '/:section' }
    ], {
        defaultRoute: 'section'
        defaultParams: {section: 'about'}
    })
    .start(function (err, state) {
        /* ... */
    });
```

A callback can be passed to start and will be invoked once the router has transitioned to the default route.

## Navigating to a specific route

Router5 exposes the following method: `navigate(routeName, routeParams, opts)`. This method has to be called for navigating to a different route: **clicks on links won't be intercepted by the router**.

```javascript
myRouter.navigate('section', {section: 'contact'});
// Will navigate to '/contact'
```

### Forcing a reload

When trying to navigate to the current route nothing will happen unless `reload` is set to `true`.

```javascript
myRouter.navigate('section', {section: 'contact'}, {reload: true});
```

### Replacing current state

Set `replace` to true for replacing the current state in history when navigating to a new route. Default behaviour is to add an entry in history.

```javascript
myRouter.navigate('section', {section: 'contact'}, {replace: true});
```

### Custom options

You can pass any option to `navigate`: those options will be added to the state of your router \(under `meta`\).

### Navigate callback

Like for `.start()`, `.navigate()` accepts a callback \(last argument\):

```javascript
myRouter.navigate('route', function (err, state) {
    /* ... */
})
```

## Stopping your router

At any time you can stop \(pause\) a router and it will prevent any navigation. To resume, simply invoke `.start()` again.

```javascript
myRouter.stop();
```

