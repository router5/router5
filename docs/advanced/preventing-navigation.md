# Preventing navigation

It is a common case to want to allow / prevent navigation away from a view or component: if a User is in the middle of completing a form and data has not been saved, you might want to warn them about data being lost or prevent them to leave the current view until data has been saved.

## Using lifecycle functions

Router5 supports `canActivate` and `canDeactivate` functions for route segments:

* `canActivate` functions are called on segments which will become active as a result of a route change
* `canDeactivate` functions are called on segments which will become inactive as a result of a route change

Both functions have the same signature than middleware functions. Their result can be synchronous \(returning a boolean\) or asynchronous \(returning a promise or calling `done(err, result)`\).

{% hint style="info" %}
if a canActivate or canDeactivate function doesn't return a boolean, a promise or doesn't call back, the transition will not proceed.
{% endhint %}

```javascript
const canActivate = (router) => (toState, fromState) => {
    return true;
}

router.canActivate('admin', canActivate);
```

`canActivate` functions are called from top to bottom on newly activated segments. `canDeactivate` methods are invoked from bottom to top.

### Using middleware functions

Middleware functions behave like `canActivate` and `canDeactivate`. Read more about [middleware](middleware.md).

