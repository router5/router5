## redux-router5@6.0.0 (2018-05-22)

#### BREAKING CHANGES
* `redux-router5`
  * [#292](https://github.com/router5/router5/pull/292) Rename `routeNodeSelector` to `createRouteNodeSelector`. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



### router5@6.2.1 (2018-05-16)

#### Bug fix
* `router5`
  * [#289](https://github.com/router5/router5/pull/289) Fix subscribe method type. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@6.2.0 (2018-05-14)

#### Bug fix
* `router5`
  * [#285](https://github.com/router5/router5/pull/285) Make sure pipe characters are encoded (Firefox issue). ([@troch](https://github.com/troch))

#### Enhancement
* `router5`
  * [#286](https://github.com/router5/router5/pull/286) Update route-node to latest patch (support `=` and `+` sign in path parameters). ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



### router5@6.1.5 (2018-05-12)

#### Enhancement
* `router5`
  * [#284](https://github.com/router5/router5/pull/284) Enhance stream libraries compatibility. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



### router5@6.1.4 (2018-05-12)

#### Enhancement
* `router5`
  * [#283](https://github.com/router5/router5/pull/283) Improve observable interoperability. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



### router5@6.1.3 (2018-05-01)

#### Bug fix
* `react-router5`
  * [#280](https://github.com/router5/router5/pull/280) Upgrade router5-transition-path in yarn lock file. ([@troch](https://github.com/troch))
* `router5`
  * [#279](https://github.com/router5/router5/pull/279) Properly apply query parameters options when building and matching. ([@troch](https://github.com/troch))

#### Enhancement
* `redux-router5`
  * [#273](https://github.com/router5/router5/pull/273) Add redux 4 as peer dependency. ([@ematipico](https://github.com/ematipico))

#### Committers: 2
- Emanuele ([ematipico](https://github.com/ematipico))
- Thomas Roch ([troch](https://github.com/troch))



### router5@6.1.2 (2018-04-20)

#### Bug fix
* `router5`
  * [#275](https://github.com/router5/router5/pull/275) Replace addEventListeners calls with addEventListener. ([@kelkes](https://github.com/kelkes))

#### Committers: 1
- David Wippel ([kelkes](https://github.com/kelkes))



### router5@6.1.1 (2018-04-20)

#### Bug fix
* `router5`
  * fix observable plugin listener registration
* `react-router5`
  * fix RouteProvider (new context API)

## router5@6.1.0 (2018-04-20)

#### Bug fix
* `router5`
  * [#271](https://github.com/router5/router5/pull/271) Don't remove trailing slash from pathname when using hash (browser plugin). ([@troch](https://github.com/troch))

#### Feature
* `react-router5`
  * [#270](https://github.com/router5/router5/pull/270) Remove need to use listeners plugin with React + smarter route node updates. ([@troch](https://github.com/troch))
* `router5`
  * [#269](https://github.com/router5/router5/pull/269) Add subscribe function and observable compatibility. ([@troch](https://github.com/troch))

#### Enhancement
* `redux-router5`
  * [#272](https://github.com/router5/router5/pull/272) Smarter route node selector updates. ([@troch](https://github.com/troch))
* `router5-transition-path`
  * [#268](https://github.com/router5/router5/pull/268) Add shouldUpdateNode function. ([@troch](https://github.com/troch))

#### Breaking Changes

* react-router5@6.0.0 needs router5@6.1.0 and above



#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))

## router5@6.0.0 (2018-04-19)

#### Feature
* `router5`
  * Navigation options are now added to state objects (in `meta`)
  * You can now specify your custom navigation options: they will be added to state objects and are usable by your custom plugins and middlewares
  * New `queryParams` option to configure how query parameters are built, and how they are parsed
  * New `caseSensitive` option (default to `false`)
* `react-router5`
  * Alternative components using a render function have been added in addition to the higher-order components. Those components require a new provider, because they leverage React new context API (React >= 16.3, see https://github.com/router5/router5/tree/master/packages/react-router5). Higher-order components won't be deprecated, and will evolve to use React new context API once deprecated.

#### Bug fix
* `router5`
  * Navigation with browser plugin and `useHash` on IE11 fixed when manually changing the URL
  * Transition phase was reowrked to support correctly state mutations in middlewares using the done callback or promises

### Breaking changes

* Path matching used to be case sensitive and it is now case insensitive by default (new `caseSensitive` option)
* Query parameters in paths can no longer be defined with `[]` (brackets should be removed)
* Option `trailingSlash` has been renamed to `strictTrailingSlash`: by default it is `false`
* Option `useTrailingSlash` has been renamed to `trailingSlashMode` with value being `'default'`, `'never'` or `'always'`
* Option `strictQueryParams` has been renamed to `queryParamsMode` with value being `'default'`, `'strict'` or `'loose'`
* Query parameters: by default boolean values are now stringified to `'true'` and `'false'`, null values are stringified without `=` sign (`{ param: null }` will be stringified to `'?param'`). To keep your current behaviour intact, set `queryParams.nullFormat` to `'hidden'` and `queryParams.booleanFormat` to `'empty-true'` (see options below)
* Private method router.makeState signature has changed (you shouldn't be impacted)

__As described above, options have been revamped to make it easier and more intuitive to configure:__

* trailingSlashMode:
  * `'default'`: building follows path definitions
  * `'none'`: when building, trailing slash is removed
  * `'always'`: when building, trailing slash is added
* queryParamsMode:
  * `'default'`: a path will match with any query parameters added, but when building, extra parameters won't appear in the returned path.
  * `'strict'`: a path with query parameters which were not listed in node definition will cause a match to be unsuccessful. When building, extra parameters won't appear in the returned path.
  * `'loose'`: a path will match with any query parameters added, and when building, extra parameters will appear in the returned path.
* queryParams:
  * `arrayFormat`: Specifies how arrays should be stringified
    * `'none'` (default): no brackets or indexes are added to query parameter names (`'role=member&role=admin'`)
    * `'brackets`: brackets are added to query parameter names (`'role[]=member&role[]=admin'`)
    * `'index'`: brackets and indexes are added to query parameter names (`'role[0]=member&role[1]=admin'`)
  * `booleanFormat`: specifies how boolean values are stringified and parsed
    * `'none'` (default): booleans are stringified to strings (`'istrue=true&isfalse=false'`)
    * `'empty-true'`: same as `'none'` except true values are stringified without value (`'istrue&isfalse=false'`). If you choose this boolean format, make sure to change the value of `'nullFormat'`.
    * `'string'`: same as `'none'` but `'true'` and `'false'` are parsed as booleans
    * `'unicode'`: `true` and `false` are displayed with unicode characters, and parsed as booleans (`'istrue=✓&isfalse=✗'`)
  * `nullFormat`: specifies how null values are stringified and parsed
    * `'default'` (default): null values are stringified without equal sign and value (`'isnull'`)
    * `'string'`: null values are stringified to `'null'` (`'isnull=null'`) and parsed as null values
    * `'hidden'`: null values are not stringified


#### Committers: 1
- Thomas Roch ([zaeleus](https://github.com/troch))



## react-router5@5.5.2 (2018-03-07)

#### Enhancement
* `react-router5`
  * [#260](https://github.com/router5/router5/pull/260) feat(react-router5): Update type definitions. ([@zaeleus](https://github.com/zaeleus))

#### Committers: 1
- Michael Macias ([zaeleus](https://github.com/zaeleus))



## react-router5@5.5.1 (2018-03-06)

#### Bug fix
* `react-router5`
  * Don't pass new callback prorps to underlying hyperlink

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## react-router5@5.5.0 (2018-03-06)

#### Feature
* `react-router5`
  * [#258](https://github.com/router5/router5/pull/258) Add successCallback and errorCallback props to React links. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.8.3 (2018-03-05)

#### Bug fix
* `router5`
  * [#256](https://github.com/router5/router5/pull/256) Update route-node to latest version (5.0.3). ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.8.2 (2018-02-13)

#### Bug fix
* `router5`
  * [#253](https://github.com/router5/router5/pull/253) When forwarding, apply default params from initial and final routes. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.8.1 (2018-02-08)

#### Bug fix
* `router5`
  * [#251](https://github.com/router5/router5/pull/251) Fix state ID generation to not duplicate on hydration. ([@whs](https://github.com/whs))

#### Committers: 1
- Manatsawin Hanmongkolchai ([whs](https://github.com/whs))



## react-router5@5.4.2 (2018-01-26)

#### Bug fix
* `react-router5`
  * [#245](https://github.com/router5/router5/pull/245) Fix route node listeners not being unregistered in routeNode HoC. ([@whs](https://github.com/whs))

#### Committers:    1
- Manatsawin Hanmongkolchai ([whs](https://github.com/whs))



## router5@5.8.0 (2018-01-25)

#### Feature
* `router5`
  * [#244](https://github.com/router5/router5/pull/244) Add optional params encoders, params decoders and default params to routes. ([@troch](https://github.com/troch))

#### Fix
* `router5`
  * Fix clone function to include route specific config like forwardTo

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## 2018-01-09

#### Enhancement
* `router5-helpers`
  * [#241](https://github.com/router5/router5/pull/241) Add type definitions for router5-helpers. ([@zaeleus](https://github.com/zaeleus))

#### Committers: 2
- Michael Macias ([zaeleus](https://github.com/zaeleus))
- Nacho Martín ([nacmartin](https://github.com/nacmartin))



## react-router@5.4.1 (2017-12-07)

#### Bug fix
* `react-router5`
  * [#231](https://github.com/router5/router5/pull/231) Typescript typings specify routerNode instead of routeNode #230. ([@texttechne](https://github.com/texttechne))

#### Committers: 1
- [texttechne](https://github.com/texttechne)



## router5@5.7.1 (2017-12-07)

#### Bug fix
* `router5`
  * [#232](https://github.com/router5/router5/pull/232) Fix reloading of routes on transition. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.7.0 (2017-11-17)

#### Feature
* `router5-transition-path`, `router5`
  * [#226](https://github.com/router5/router5/pull/226) Add type definitions for router5-transition-path. ([@zaeleus](https://github.com/zaeleus))

#### Enhancement
* `react-router5`, `redux-router5`, `router5-helpers`, `router5-transition-path`, `router5`, `rxjs-router5`, `xstream-router5`
  * [#225](https://github.com/router5/router5/pull/225) Configure all packages with jnext:main and module. ([@troch](https://github.com/troch))

#### Committers: 2
- Michael Macias ([zaeleus](https://github.com/zaeleus))
- Thomas Roch ([troch](https://github.com/troch))



## 2017-11-15

#### Enhancement
* `react-router5`
  * [#224](https://github.com/router5/router5/pull/224) Fix HOC types. ([@faergeek](https://github.com/faergeek))
* `deku-router5`, `examples`, `react-router5`, `redux-router5`, `router5-helpers`, `router5-transition-path`, `router5`, `rxjs-router5`, `xstream-router5`
  * [#223](https://github.com/router5/router5/pull/223) Prettier tweaks. ([@faergeek](https://github.com/faergeek))

#### Committers: 1
- Sergey Slipchenko ([faergeek](https://github.com/faergeek))



## router5@5.6.0 (2017-11-09)

#### Bug fix
* `redux-router5`
  * [#219](https://github.com/router5/router5/pull/219) Fix return type of reduxPlugin (TypeScript). ([@zaeleus](https://github.com/zaeleus))

#### Enhancement
* `router5`
  * [#218](https://github.com/router5/router5/pull/218) router5: Update type definitions. ([@zaeleus](https://github.com/zaeleus))
  * [#220](https://github.com/router5/router5/pull/220) Improve path building and parsing error messages. ([@troch](https://github.com/troch))

#### Committers: 3
- Michael Macias ([zaeleus](https://github.com/zaeleus))
- Sergey Slipchenko ([faergeek](https://github.com/faergeek))
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.5.0 (2017-11-01)

#### Feature
* `react-router5`
  * [#209](https://github.com/router5/router5/pull/209) Add types for react-router5. ([@jkelin](https://github.com/jkelin))
* `redux-router5`
  * [#210](https://github.com/router5/router5/pull/210) Add types for redux-router5. ([@jkelin](https://github.com/jkelin))

#### Enhancement
* `redux-router5`
  * [#214](https://github.com/router5/router5/pull/214) Fix routeNodeSelector type. ([@faergeek](https://github.com/faergeek))
* `router5`
  * [#212](https://github.com/router5/router5/pull/212) Remove `?` from middleware `done` arg to avoid checking it's presence. ([@faergeek](https://github.com/faergeek))

#### Committers: 2
- Jan Kelin ([jkelin](https://github.com/jkelin))
- Sergey Slipchenko ([faergeek](https://github.com/faergeek))



## router5@5.4.0 (2017-10-15)

#### Enhancement
* `router5`
  * [#207](https://github.com/router5/router5/pull/207) Update route-node package to latest version. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.3.0 (2017-10-05)

#### Feature
* `router5`
  * [#203](https://github.com/router5/router5/pull/203) Update route-node to v1.9.0. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## react-router5@5.2.0 (2017-10-04)

#### Feature
* `react-router5`
  * [#201](https://github.com/router5/router5/pull/201) Pass link props to its hyperlink element. ([@troch](https://github.com/troch))

#### Committers: 1
- Thomas Roch ([troch](https://github.com/troch))



## router5@5.2.2 (2017-09-29)

### Enhancement
* `router5`
  * [#196](https://github.com/router5/router5/pull/196) Add type definition for `persistentParamsPlugin`. ([@acchou](https://github.com/acchou))

#### Committers: 1
- Andy Chou ([acchou](https://github.com/acchou))



## rxjs-router5@5.1.0 (2017-09-29)

#### Feature
* `rxjs-router5`
  * [#198](https://github.com/router5/router5/pull/198) Add typings for rxjs-router5. ([@acchou](https://github.com/acchou))

#### Committers: 1
- Andy Chou ([acchou](https://github.com/acchou))



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
