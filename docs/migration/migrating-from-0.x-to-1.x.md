# Migrating from 0.x to 1.x

> _router5_ is available in all major formats: **ES6**, **CommonJS**, and **UMD**.

It can be installed using **npm** or **yarn**. Alternatively, you can download a specific version from [github](https://github.com/router5/router5/releases).

## Installation

```bash
# yarn
yarn add router5
# npm
npm install router5
```

## Include _router5_ in your application

**CommonJS**

```javascript
// ES2015+
import createRouter, { RouteNode, errorCodes, transitionPath, loggerPlugin, constants } from 'router5';

import browserPlugin from 'router5-plugin-browser';
import listenersPlugin from 'router5-plugin-listeners';
import persistentParamsPlugin from 'router5-plugin-persistent-params';

// ES5
var router5 = require('router5');

var createRouter = router5.default;
var RouteNode = router5.RouteNode;
var errorCodes = router5.errorCodes;
var constants = router5.constants;
var transitionPath = router5.transitionPath;
var loggerPlugin = router5.loggerPlugin;
var constants = router5.constants;

var browserPlugin = require('router5-plugin-browser');
var listenersPlugin = require('router5-plugin-listeners');
var persistentParamsPlugin = require('router5-plugin-persistent-params');
```

**UMD**

A UMD bundle is available in `/dist/umd`, and it should be used for AMD or globals. The bundle contains all _router5_ dependencies \(_route-node_ and _path-parser_\), but doesn't contain plugins.

Plugins are packaged separately and available in `/dist/umd`:

* `browserPlugin` UMD module is named `router5BrowserPlugin`
* `listenersPlugin` UMD module is named `router5ListenersPlugin`
* `persistentParamsPlugin` UMD module is named `router5PersistentParamsPlugin`

  bundle is named `router5ListenersPlugin`.

