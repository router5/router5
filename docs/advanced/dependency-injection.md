# Dependency injection

When using lifecycle methods \(`canActivate`, `canDeactivate`\), middleware or plugins, you might need to access specific objects from your application: a store, a specific API, etc... You can pass their reference to router5 and they will be passed alongside your router instance.

For TypeScript users, `createRouter` accepts a generic for typing dependencies.

You can register all dependencies at once, or one by one.

```javascript
const router = createRouter(routes, options, dependencies)
```

```javascript
router.setDependencies({ store, api })
// or
router.setDependency('store', store)
router.setDependency('api', api)
```

You can retrieve your current dependencies references using `getDependencies()`.

Lifecycle methods \(`canActivate`, `canDeactivate`\), middleware or plugins will be called with them:

```javascript
const plugin = (router, dependencies) => ({
    /*
        onStart() {},
        onStop() {},
        onTransitionStart() {},
        ...
    */
})
```

```javascript
const canActivate = (router, dependencies) =>
    (toState, fromState, done) {
        /* ... */
    }
```

```javascript
const middleware = (router, dependencies) =>
    (toState, fromState, done) {
        /* ... */
    }
```
