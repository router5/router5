<a name="0.5.5"></a>
## 0.5.5 (2015-09-04)


### Bug Fixes

* call error callbacks with right arguments ([bde616c](https://github.com/router5/router5/commit/bde616c))



<a name="0.5.4"></a>
## 0.5.4 (2015-09-04)


### Bug Fixes

* don't set base if useHash is falsy or if it has been provided ([66ae677](https://github.com/router5/router5/commit/66ae677))
* invoke error callbacks in places where it is not called ([92f9719](https://github.com/router5/router5/commit/92f9719)), closes [#22](https://github.com/router5/router5/issues/22)



<a name="0.5.3"></a>
## 0.5.3 (2015-09-01)




<a name="0.5.2"></a>
## 0.5.2 (2015-09-01)




<a name="0.5.1"></a>
## 0.5.1 (2015-08-31)


### Features

* add `matchUrl` for matching full URLs ([22daedd](https://github.com/router5/router5/commit/22daedd))



<a name="0.5.0"></a>
# 0.5.0 (2015-08-24)


### Features

* support optional trailing slashes in URL ([60ba973](https://github.com/router5/router5/commit/60ba973))



<a name="0.4.2"></a>
## 0.4.2 (2015-07-29)


### Features

* add transition hooks (onTransitionStart, onTransitionCancel, onTransitionError) ([d166cb0](https://github.com/router5/router5/commit/d166cb0))



<a name="0.4.1"></a>
## 0.4.1 (2015-07-29)


### Bug Fixes

* update route-node dep version to improve node children matching order ([ff1516d](https://github.com/router5/router5/commit/ff1516d))



<a name="0.4.0"></a>
# 0.4.0 (2015-07-29)


### Bug Fixes

* improve handling of arguments in start function ([e17ed69](https://github.com/router5/router5/commit/e17ed69))
* replace history state on start when supplying a starting state ([43127f2](https://github.com/router5/router5/commit/43127f2))

### Features

* add support for onTransition middleware function ([259065f](https://github.com/router5/router5/commit/259065f))



<a name="0.3.1"></a>
## 0.3.1 (2015-07-27)


### Bug Fixes

* fix build ([8b99291](https://github.com/router5/router5/commit/8b99291))



<a name="0.3.0"></a>
# 0.3.0 (2015-07-27)


### Bug Fixes

* onPopState listener removal ([0d5fea1](https://github.com/router5/router5/commit/0d5fea1))

### Features

* add option to pass a start path or state to `.start()` ([cbc39ae](https://github.com/router5/router5/commit/cbc39ae))
* support universal javascript applications ([be5b6da](https://github.com/router5/router5/commit/be5b6da))



<a name="0.2.7"></a>
## 0.2.7 (2015-07-24)


### Features

* v0.2.7 adds support for IE10 and IE11 ([cd805ef](https://github.com/router5/router5/commit/cd805ef))


<a name="0.2.6"></a>
## 0.2.6 (2015-07-23)


### Bug Fixes

* don't push state on popstate when no error ([98b9215](https://github.com/router5/router5/commit/98b9215)), closes [#11](https://github.com/router5/router5/issues/11)



<a name="0.2.5"></a>
## 0.2.5 (2015-07-23)


### Bug Fixes

* Commonjs and UMD release ([05811a8](https://github.com/router5/router5/commit/05811a8))

### Features

* call unnamed root node listener on first route transition (toState is null) ([618ef81](https://github.com/router5/router5/commit/618ef81))



<a name="0.2.4"></a>
## 0.2.4 (2015-07-23)


### Bug Fixes

* double slash in paths (base path parsing) ([7820a3b](https://github.com/router5/router5/commit/7820a3b))

### Features

* add base option for applications not using hash and having a non-empty base path ([42ea04e](https://github.com/router5/router5/commit/42ea04e))
* add error codes to Router5 (Router5.ERR) ([ac6b0bb](https://github.com/router5/router5/commit/ac6b0bb))


<a name="0.2.3"></a>
## 0.2.3 (2015-07-23)


### Bug Fixes

* better route matching by improving matching order ([2ce0605](https://github.com/router5/router5/commit/2ce0605))

### Features

* add AMD bundle ([9a24441](https://github.com/router5/router5/commit/9a24441))


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



