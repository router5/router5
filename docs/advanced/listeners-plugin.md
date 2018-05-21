# Listeners plugin

{% hint %}
`router.subscribe` is now available and as a result listeners plugin is no longer needed by `react-router5`. This will be deprecated in a near future.
{% endhint %}


## Usage

```javascript
import listenersPlugin from 'router5/plugins/listeners';

const router = createRouter()
    .usePlugin(listenersPlugin());
```


## Types of listeners

Listeners are called with `toState` and `fromState` arguments.


### Listen to a node change

`addNodeListener(name, fn)` will register a listener which will be invoked when the specified route node
is the __transition node__ of a route change, i.e. the intersection between deactivated and activated segments.


## Listen to any route change

Listeners registered with `addListener(fn)` will be triggered on any route change, including route reloads (_toState_
will be equal to _fromState_). You can remove a previously added listener by using `removeListener(fn)`.


## Listen to a specific route

`addRouteListener(name, fn)` will register a listener which will be triggered when the router is navigating to the supplied route name.
