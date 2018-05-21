# Migrating from 2.x to 3.x


## New features

* When a transition fails (either in a `canActivate`, `canDeactivate` or middleware function), a custom error can be returned containing a `redirect` property.
* Persistent parameters plugin now available.

## Breaking change

There are no breaking changes.

## Code example

Redirecting to a login page if the current user is not logged in:

```javascript
// With promises
router.canActivate(
    'profile',
    () => isLoggedIn()
        .catch(() => ({ redirect: { name: 'login' } }))
);

// With callbacks
router.canActivate(
    'profile',
    (toState, fromState, done) => {
        isLoggedIn()
            .then(() => done(null, toState))
            .catch(() => done(({ redirect: { name: 'login' } })))
    }
);
```
