# API Reference


## Core API


### createRouter

Create a router instance

```js
const router = createRouter([routes], [options], [dependencies])
```

- `routes`: your application routes, see [defining routes](./guides/defining-routes.md)
- `options`: your router options, see [router options](./guides/router5-options.md)
- `dependencies`: the dependencies you want to make available in middleware and plugins, see [dependency injection](./adavanced/dependency-injection.md)


### clone

Clone an existing router.

```js
const clonedRouter = router.clone(dependencies)
```

- `dependencies`: the new dependencies, for the cloned router


### add

Add routes, see [defining routes](./guides/defining-routes.md)

```js
router.add(routes)
```


### start

```js
router.start(startPathOrState, [done])
```

- `startPathOrState`: a starting path (string) or state (object). When using `browserPlugin`, this argument is optional: path will be read from the document location
- `done`: a done callback (`done(err, state)`)


### isStarted

Check if the router is in a started state

```js
router.isStarted()
```


### navigate

Navigate to a new route

```js
router.navigate(routeName, [routeParams], [options], [done])
```

- `routeName`: the name of the route to navigate to
- `routeParams`: the route params
- `options`: options for the transition (`replace`, `reload`, `skipTransition`, `force` or any custom option)
- `done`: a done callback (`done(err, state)`)


### navigateToDefault

Navigate to the default route (if any)

```js
router.navigateToDefault([opts], [done])
```


### Stop

Stop your router

```js
router.stop()
```


### cancel

Cancel the current transition (if any)

```js
router.cancel()
```


### forward

Set a route to forward to another route (when navigating to the first one)

```
router.forward(fromRoute, toRoute)
```


### getState

Return the current state

```js
const state = router.getState()
```


### getOptions

Return current options

```js
router.getOptions()
```


### setOption

Set an option

```js
router.setOption(name, value)
```


### setDependency

Set a dependency

```js
router.setDependency(dependencyName, dependency)
```


### setDependencies

Set dependencies

```js
router.setDependencies(dependencies)
```


### getDependencies

Return the current dependencies

```js
const dependencies = router.getDependencies()
```


### useMiddleware

Register one or multiple middlewares, see [middleware](./advanced/middleware.md)

```js
router.useMiddleware(...middlewares)
```


### clearMiddleware

Remove all middleware

```js
router.clearMiddleware()
```


### usePlugin

Register one or multiple plugins, see [plugins](./advanced/plugins.md)

```js
router.usePlugin(...plugins)
```


### hasPlugin

Check if a plugin is in use

```js
router.hasPlugin(pluginName)
```


### canActivate

Set a `canActivate` handler for the provided route name, see [preventing navigation](./advanced/preventing-navigation.md)

```js
router.canActivate(name, canActivateHandler)
```


### canDeactivate

Set a `canDeactivate` handler for the provided route name, see [preventing navigation](./advanced/preventing-navigation.md)

```js
router.canDeactivate(name, canDeactivateHandler)
```


### clearCanDeactivate

Remove a `canDeactivate` handler for the provided route name

```js
router.clearCanDeactivate(name)
```


### buildPath

Build a path given a route name and params

```js
router.buildPath(route, params)
```


### matchPath

Attempt to match a path

```js
router.matchPath(path, [source])
```


### setRootPath

Set the root path

```js
router.setRootPath(rootPath)
```


### isActive

Check if the provided route is currently active

```js
router.isActive(name, params, [strictEquality], [ignoreQueryParams])
```

- `name`: the route name
- `params`: the route params
- `strictEquality`: whether to check if the given route is the active route, or a descendant of the active route (`false` by default)
- `ignoreQueryParams`: whether to ignore query params (`true` by default)


### areStateEqual

Compare two route state objects

```js
router.areStatesEqual(state1, state2, ignoreQueryParams)
```


### areStatesDescendants

Check if a state is a descendant of another state

```js
router.areStatesDescendants(parentState, childState)
```


## Browser plugin


See [in the browser](./guides/browser.md)

The browser plugin adds the following to your router instance:


### buildUrl

Build an URL

```js
router.buildUrl(routeName, routeParams)
```


### matchUrl

Match an URL

```js
router.matchUrl(url)
```


### replaceHistoryState

Replace state in history and silently update your router instance state. Use if you know what you are doing.

```js
router.replaceHistoryState(name, params)
```
