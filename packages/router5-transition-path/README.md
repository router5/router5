# transition-path

Router5 helper to determine a transition path.

### Installation

```
npm install --save router5-transition-path
```

### Usage

This module exports a `transitionPath` function which can compute the transition path between two router5 states: segments to deactivate, segments to activate and intersection node between the two.

It also exports (as named exports) a `nameToIDs` function for transforming a route name to a list of segments.

```javascript
import transitionPath from 'router5-transition-path';

const { toActivate, toDeactivate, intersection } = transitionPath(toState, fromState);
```

__ES5__

```javascript
var transitionPath = require('router5-transition-path').default;
```

See the tests for examples.
