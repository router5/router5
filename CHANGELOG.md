<a name="0.2.2"></a>
## 0.2.2 (2015-07-23)


### Bug Fixes

* don't invoke callback if not present in start ([3ecc838](https://github.com/router5/router5/commit/3ecc838))



<a name="0.2.1"></a>
## 0.2.1 (2015-07-22)


### Bug Fixes

* call transition on start when matched route present (call canActivate methods) ([0efc4e6](https://github.com/router5/router5/commit/0efc4e6))



<a name="0.2.0"></a>
# 0.2.0 (2015-07-21)


### Bug Fixes

* take into account search part of URL when matching a path ([535f98c](https://github.com/router5/router5/commit/535f98c))

### Features

* add support for a canActivate method per route ([424c987](https://github.com/router5/router5/commit/424c987))
* limit node listeners to one per node ([a4ed868](https://github.com/router5/router5/commit/a4ed868))
* support asynchronous results for canActivate, canDeactivate and node listeners ([445892a](https://github.com/router5/router5/commit/445892a))



<a name="0.1.0"></a>
# 0.1.0 (2015-07-16)


### Features

* add support for hashPrefix option ([cdcd5e3](https://github.com/router5/router5/commit/cdcd5e3)), closes [#1](https://github.com/router5/router5/issues/1)



<a name="0.1.0-rc.7"></a>
# 0.1.0-rc.7 (2015-07-09)


### Bug Fixes

* bugs related to getting location ([4c6a1d2](https://github.com/router5/router5/commit/4c6a1d2))

### Features

* don't bind listeners to router instance ([1a7246d](https://github.com/router5/router5/commit/1a7246d))
* improve isActive function (strict equality an option) ([732816f](https://github.com/router5/router5/commit/732816f))



<a name="0.1.0-rc.5"></a>
# 0.1.0-rc.5 (2015-07-07)


### Bug Fixes

* duplicated use strict in browser dist ([fe77f3c](https://github.com/router5/router5/commit/fe77f3c))
* take into account initial path ([5188f47](https://github.com/router5/router5/commit/5188f47))

### Features

* add isActive(name, params) function ([26303da](https://github.com/router5/router5/commit/26303da))



<a name="0.1.0-rc.3"></a>
# 0.1.0-rc.3 (2015-07-06)


### Features

* make listeners chainable and return transition result in navigate ([f725296](https://github.com/router5/router5/commit/f725296))
* node listeners on unamed root node ([b52beb2](https://github.com/router5/router5/commit/b52beb2))


<a name="0.0.1-alpha.9"></a>
## 0.0.1-alpha.9 (2015-07-03)


### Features

* add route listeners ([ff554f7](https://github.com/router5/router5/commit/ff554f7))
* react to manual change in URL ([1e35d18](https://github.com/router5/router5/commit/1e35d18))



<a name="0.0.1-alpha.7"></a>
## 0.0.1-alpha.7 (2015-07-03)


### Bug Fixes

* update lastKnownState before invoking callbacks ([8904cfd](https://github.com/router5/router5/commit/8904cfd))

### Features

* add setOption(opt, val) chainable method ([b45b0de](https://github.com/router5/router5/commit/b45b0de))



<a name="0.0.1-alpha.5"></a>
## 0.0.1-alpha.5 (2015-07-02)


### Bug Fixes

* order of components deactivation ([a7b7ed3](https://github.com/router5/router5/commit/a7b7ed3))

### Features

* add addNode chainable function ([49f1238](https://github.com/router5/router5/commit/49f1238))
* expose areStatesEqual function and add hash to buildPath function if useHash is  ([337b4e5](https://github.com/router5/router5/commit/337b4e5))



<a name="0.0.1-alpha.3"></a>
## 0.0.1-alpha.3 (2015-07-02)


### Bug Fixes

* bug with reload option and same states ([2317287](https://github.com/router5/router5/commit/2317287))

### Features

* add Router5 class with basic functionalities ([c72be0b](https://github.com/router5/router5/commit/c72be0b))
* add hash support and default route ([086ead0](https://github.com/router5/router5/commit/086ead0))
* add start and add methods and make them chainable with constructor ([4808750](https://github.com/router5/router5/commit/4808750))
* add stop function and started flag ([ea30ac6](https://github.com/router5/router5/commit/ea30ac6))
* do not push to history if states are the same and support reload option ([9734c8a](https://github.com/router5/router5/commit/9734c8a))
* register callbacks on specific nodes ([392a647](https://github.com/router5/router5/commit/392a647))
* request component deactivation on route transition ([78c1a51](https://github.com/router5/router5/commit/78c1a51))



