# API Reference

## Core API

### createRouter

Create a router instance

```javascript
const router = createRouter([routes], [options], [dependencies])
```

* `routes`: your application routes, see [defining routes](guides/defining-routes.md)
* `options`: your router options, see [router options](https://github.com/router5/router5/tree/1cc1c6969a96918deb28e45b8c5b2d6aa19d0a19/docs/guides/router5-options.md)
* `dependencies`: the dependencies you want to make available in middleware and plugins, see [dependency injection](https://github.com/router5/router5/tree/1cc1c6969a96918deb28e45b8c5b2d6aa19d0a19/docs/adavanced/dependency-injection.md)

### cloneRouter

Clone an existing router.

```javascript
const clonedRouter = cloneRouter(router, dependencies)
```

* `router`: the router instance to clone
* `dependencies`: the new dependencies, for the cloned router (optional)

### add

Add routes, see [defining routes](guides/defining-routes.md)

```javascript
router.add(routes)
```

### start

```javascript
router.start(startPathOrState, [done])
```

* `startPathOrState`: a starting path \(string\) or state \(object\). When using `browserPlugin`, this argument is optional: path will be read from the document location
* `done`: a done callback \(`done(err, state)`\)

### isStarted

Check if the router is in a started state

```javascript
router.isStarted()
```

### navigate

Navigate to a new route

```javascript
router.navigate(routeName, [routeParams], [options], [done])
```

* `routeName`: the name of the route to navigate to
* `routeParams`: the route params
* `options`: options for the transition \(`replace`, `reload`, `skipTransition`, `force` or any custom option\)
* `done`: a done callback \(`done(err, state)`\)

### navigateToDefault

Navigate to the default route \(if any\)

```javascript
router.navigateToDefault([opts], [done])
```

### Stop

Stop your router

```javascript
router.stop()
```

### cancel

Cancel the current transition \(if any\)

```javascript
router.cancel()
```

### forward

Set a route to forward to another route \(when navigating to the first one\)

```text
router.forward(fromRoute, toRoute)
```

### getState

Return the current state

```javascript
const state = router.getState()
```

### getOptions

Return current options

```javascript
router.getOptions()
```

### setOption

Set an option

```javascript
router.setOption(name, value)
```

### setDependency

Set a dependency

```javascript
router.setDependency(dependencyName, dependency)
```

### setDependencies

Set dependencies

```javascript
router.setDependencies(dependencies)
```

### getDependencies

Return the current dependencies

```javascript
const dependencies = router.getDependencies()
```

### useMiddleware

Register one or multiple middlewares, see [middleware](advanced/middleware.md)

```javascript
const remove = router.useMiddleware(...middlewares)
```

### clearMiddleware

Remove all middleware

```javascript
router.clearMiddleware()
```

### usePlugin

Register one or multiple plugins, see [plugins](advanced/plugins.md)

```javascript
const teardown = router.usePlugin(...plugins)
```


### canActivate

Set a `canActivate` handler for the provided route name, see [preventing navigation](advanced/preventing-navigation.md)

```javascript
router.canActivate(name, canActivateHandler)
```

### canDeactivate

Set a `canDeactivate` handler for the provided route name, see [preventing navigation](advanced/preventing-navigation.md)

```javascript
router.canDeactivate(name, canDeactivateHandler)
```

### clearCanDeactivate

Remove a `canDeactivate` handler for the provided route name

```javascript
router.clearCanDeactivate(name)
```

### buildPath

Build a path given a route name and params

```javascript
router.buildPath(route, params)
```

### matchPath

Attempt to match a path

```javascript
router.matchPath(path, [source])
```

### setRootPath

Set the root path

```javascript
router.setRootPath(rootPath)
```

### isActive

Check if the provided route is currently active

```javascript
router.isActive(name, params, [strictEquality], [ignoreQueryParams])
```

* `name`: the route name
* `params`: the route params
* `strictEquality`: whether to check if the given route is the active route, or a descendant of the active route \(`false` by default\)
* `ignoreQueryParams`: whether to ignore query params \(`true` by default\)

### areStateEqual

Compare two route state objects

```javascript
router.areStatesEqual(state1, state2, ignoreQueryParams)
```

### areStatesDescendants

Check if a state is a descendant of another state

```javascript
router.areStatesDescendants(parentState, childState)
```

## Browser plugin

See [in the browser](guides/in-the-browser.md)

The browser plugin adds the following to your router instance:

### buildUrl

Build an URL

```javascript
router.buildUrl(routeName, routeParams)
```

### matchUrl

Match an URL

```javascript
router.matchUrl(url)
```

### replaceHistoryState

Replace state in history and silently update your router instance state. Use if you know what you are doing.

```javascript
router.replaceHistoryState(name, params)
```

