## router5@5.2.1 (2017-09-27)

#### Bug fix
* `router5`
  * [#193](https://github.com/router5/router5/pull/193) Fix TypeScript definition of router.usePlugin. ([@Keats](https://github.com/Keats))

#### Committers: 1
- Vincent Prouillet ([Keats](https://github.com/Keats))



## router5@5.2.0 (2017-09-26)

#### Bug fix
* `router5`
  * [#192](https://github.com/router5/router5/pull/192) Router plugin buildUrl should return null for undefined routes. ([@ezzatron](https://github.com/ezzatron))
  * [#188](https://github.com/router5/router5/pull/188) Force redirections on error. ([@troch](https://github.com/troch))

#### Feature
* `router5`
  * [#162](https://github.com/router5/router5/pull/162) Add navigation option to skip transition. ([@troch](https://github.com/troch))

#### Enhancement
* `router5`
  * [#181](https://github.com/router5/router5/pull/181) Update typescript definition to latest docs. ([@Sebazzz](https://github.com/Sebazzz))
  * [#190](https://github.com/router5/router5/pull/190) Use console.groupCollapsed() in the logger plugin, where available. ([@ezzatron](https://github.com/ezzatron))

#### Committers: 3
- Erin ([ezzatron](https://github.com/ezzatron))
- Sebastiaan Dammann ([Sebazzz](https://github.com/Sebazzz))
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.1.7 (2017-09-04)

#### Bug fix
* `router5`
  * [#187](https://github.com/router5/router5/pull/187) Preserve state IDs on popstate. ([@troch](https://github.com/troch))
  * [#186](https://github.com/router5/router5/pull/186) Only use console groups in logger if available. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.1.6 (2017-08-10)

#### Bug fix
* `router5`
  * [#172](https://github.com/router5/router5/pull/172) Prevent empty arrays to be serialised in search part. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



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
