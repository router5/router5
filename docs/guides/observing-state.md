# Observing state

From router5@6.1.0 and onwards, your router instance is compatible with most observable libraries.

## Subscribing to state changes

You can subscribe to route changes using `router.subscribe()`, and will receive an object containing `route` and `previousRoute`.

## Observing state changes

Router instances are observables. You can use most stream libraries out there and create a stream from your router instance:

* RxJS \(`Rx.Observable.from(router)`\)
* xstream \(`xs.fromObservable(router)`\)
* most \(`most.from(router)`\)
* etc...

