# transition-path

Router5 helper to determine a transition path. Used by [router5](https://github.com/router5/router5), [router5-listeners](https://github.com/router5/router5-listeners) and [redux-router5](https://github.com/router5/redux-router5).

### Installation

```
npm install --save router5.transition-path
```

### Usage

This module exports a `transitionPath` function which can compute the transition path between two router5 states: segments to deactivate, segments to activate and intersection node between the two.

It also exports (as named exports) a `nameToIDs` function for transforming a route name to a list of segments.

```javascript
import transitionPath from 'router5.transition-path';

const { toActivate, toDeactivate, intersection } = transitionPath(toState, fromState);
```

__ES5__

```javascript
var transitionPath = require('router5.transition-path').default;
```

See the tests for examples.
