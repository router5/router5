## router5@5.1.4 (2017-08-04)

#### Bug fix
* `router5`
  * [#167](https://github.com/router5/router5/pull/167) Update route-node to latest version. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.1.3 (2017-07-27)

#### Bug fix
* `router5`
  * [#166](https://github.com/router5/router5/pull/166) Set source to 'popstate' in meta of state changes caused by history popstate events. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.1.2 (2017-07-03)

#### Bug fix
* `router5`
  * [#160](https://github.com/router5/router5/pull/160) Fix cannot deactivate condition in browser plugin popstate handler. ([@troch](https://github.com/troch))
  * [#159](https://github.com/router5/router5/pull/159) Correct state comparison (areStatesEqual) with non-strict query parameters. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.1.1 (2017-06-30)

#### Bug fix
* `router5`
  * [#158](https://github.com/router5/router5/pull/158) Allow route forwarding on router start. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))


## router5@5.1.0

#### Also released

- react-router5@5.0.2
- rxjs-router5@5.0.2
- xstream-router5@5.0.2

#### Feature
* `router5`
  * [#154](https://github.com/router5/router5/pull/154) Route forwarding. ([@troch](https://github.com/troch))

#### House keeping
* `react-router5`, `rxjs-router5`, `xstream-router5`
  * [#156](https://github.com/router5/router5/pull/156) Remove package internal dev dependencies. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



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
