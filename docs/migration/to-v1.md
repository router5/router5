# Getting started

> _router5_ is available in all major formats: __ES6__, __CommonJS__, and __UMD__.

It can be installed using __npm__ or __yarn__. Alternatively, you can download a specific version
from [github](https://github.com/router5/router5/releases).


## Installation

```sh
# yarn
yarn add router5
# npm
npm install router5
```

## Include _router5_ in your application

__CommonJS__


```javascript
// ES2015+
import createRouter, { RouteNode, errorCodes, transitionPath, loggerPlugin, constants } from 'router5';

import browserPlugin from 'router5/plugins/browser';
import listenersPlugin from 'router5/plugins/listeners';
import persistentParamsPlugin from 'router5/plugins/persistentParams';

// ES5
var router5 = require('router5');

var createRouter = router5.default;
var RouteNode = router5.RouteNode;
var errorCodes = router5.errorCodes;
var constants = router5.constants;
var transitionPath = router5.transitionPath;
var loggerPlugin = router5.loggerPlugin;
var constants = router5.constants;

var browserPlugin = require('router5/plugins/browser');
var listenersPlugin = require('router5/plugins/listeners');
var persistentParamsPlugin = require('router5/plugins/persistentParams');
```

__UMD__

A UMD bundle is available in `/dist/umd`, and it should be used for AMD or globals. The bundle contains all _router5_ dependencies (_route-node_ and _path-parser_), but doesn't contain plugins.

Plugins are packaged separately and available in `/dist/umd`:
- `browserPlugin` UMD module is named `router5BrowserPlugin`
- `listenersPlugin` UMD module is named `router5ListenersPlugin`
- `persistentParamsPlugin` UMD module is named `router5PersistentParamsPlugin`
bundle is named `router5ListenersPlugin`.
