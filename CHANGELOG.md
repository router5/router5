<a name="5.0.0"></a>
# 5.0.0


### Bug Fixes

* only preserve hash when `useHash` is false ([e8bb4df](https://github.com/router5/router5/commit/e8bb4df))
* pass not found state to middleware functions on start ([0d0bf75](https://github.com/router5/router5/commit/0d0bf75))


### Breaking changes

* Not found state is now passed to middleware functions on start
* router `strictQueryParams` option is now `false` by default
* browser plugin option `preserveHash` is now `true` by default
* router5.helpers package has been renamed to router5-helpers
* router5.transition-path package has been renamed to router5-transition-path
* router5 won't be released with bower beyond version 4


**For previous versions (4 and below), see:**

-  [packages/router5/CHANGELOG.md](packages/router5/CHANGELOG.md)
-  [packages/react-router5/CHANGELOG.md](packages/react-router5/CHANGELOG.md)
-  [packages/redux-router5/CHANGELOG.md](packages/redux-router5/CHANGELOG.md)
-  [packages/deku-router5/CHANGELOG.md](packages/deku-router5/CHANGELOG.md)
-  [packages/router5-transition-path/CHANGELOG.md](packages/router5-transition-path/CHANGELOG.md)
