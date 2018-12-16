# Router5 persistent params plugin

Persist params on navigation. You just have to pass to the plugin an array of persistent parameters, and those parameters will be added to any route as query parameters (using their last known value). Note: if you use # in your routes, they are not "true" query parameters.

For now, only query parameters are supported. It works by modifying the path of the root node of your tree of routes (by default the root node path is ''). If you need support for other types of parameters, please raise an issue to discuss it.

```js
import persistentParamsPlugin from 'router5-plugin-persistent-params'

const router = new Router5()

router.usePlugin(persistentParamsPlugin(['mode']));
```
