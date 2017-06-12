# helpers

Helpers for comparing and checking routes.


## API

_route can be a route name (string) or state object containing a name property_

- __startsWithSegment(route, segment)__
- __endsWithSegment(route, segment)__
- __includesSegment(route, segment)__

__redirect function__

This package also contains a redirect function for `onActivate` handlers.

- __redirect(fromRouteName, toRouteName, toRouteParams)__, where toRouteParams can an object or a function of the attempted route params.


### All functions are available in their curried form (kinda)

- __startsWithSegment(route)(segment)__
- __endsWithSegment(route)(segment)__
- __includesSegment(route)(segment)__
- __redirect(fromRouteName)(toRouteName, toRouteParams)__

```javascript
import * as helpers from 'router5.helpers';

startsWithSegment('users', 'users');      // => true
startsWithSegment('users.list', 'users'); // => true

startsWithSegment('users.list')('users'); // => true
```
