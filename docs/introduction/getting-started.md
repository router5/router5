# Getting started

_router5_ is available in all major formats: __ES6__, __CommonJS__, and __UMD__. It can be installed using __npm__ or __yarn__. Alternatively, you can download a specific version
from [github](https://github.com/router5/router5/releases).


## Installation

```
# yarn
yarn add router5
# npm
npm install router5
```

## Include router5 in your application

### ES2015 syntax

```js
// ES2015+
import createRouter from 'router5';

import browserPlugin from 'router5/plugins/browser';
import persistentParamsPlugin from 'router5/plugins/persistentParams';
```

### CommonJS syntax

```js
var createRouter = require('router5').default;
var browserPlugin = require('router5/plugins/browser');
var persistentParamsPlugin = require('router5/plugins/persistentParams');
```

### UMD

Various UMD bundles are accessible under `/dist/umd`: you should use them for AMD or global. The router5 bundle contains all _router5_ dependencies (_route-node_ and _path-parser_), but doesn't contain plugins.
