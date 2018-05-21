# Migrating from 5.x to 6.x


With version 6.0.0, router options have been reworked to be more intuitive and more flexible to use. Defaults have changed, but you can set options so your current URLs remain unchanged.


## Feature
* `router5`
  * Navigation options are now added to state objects (in `meta`)
  * You can now specify your custom navigation options: they will be added to state objects and are usable by your custom plugins and middlewares
  * New `queryParams` option to configure how query parameters are built, and how they are parsed
  * New `caseSensitive` option (default to `false`)
* `react-router5`
  * Alternative components using a render function have been added in addition to the higher-order components. Those components require a new provider, because they leverage React new context API (React >= 16.3, see https://github.com/router5/router5/tree/master/packages/react-router5). Higher-order components won't be deprecated, and will evolve to use React new context API once deprecated.

## Bug fix
* `router5`
  * Navigation with browser plugin and `useHash` on IE11 fixed when manually changing the URL
  * Transition phase was reowrked to support correctly state mutations in middlewares using the done callback or promises

## Breaking changes

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
