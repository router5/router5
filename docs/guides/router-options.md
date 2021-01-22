# Router options

You can configure your router instance by passing options to the constructor or by using `.setOption(optName, optValue)`.

```javascript
var router = createRouter([], {
    allowNotFound: false,
    autoCleanUp: true,
    defaultRoute: 'home',
    defaultParams: {},
    queryParams: {
        arrayFormat: 'default',
        nullFormat: 'default',
        booleanFormat: 'default'
    },
    queryParamsMode: 'default',
    trailingSlashMode: 'default',
    strictTrailingSlash: false,
    caseSensitive: false,
    urlParamsEncoding: 'default'
})
```

## Default route

When your router instance starts, it will navigate to a default route if such route is defined and if it cannot match the URL against a known route:

-   `defaultRoute`: the default route.
-   `defaultParams`: the default route params \(defaults to `{}`\)

See [navigation guide](https://github.com/router5/router5/blob/master/docs/guides/navigating.md) for more information.

## Allow not found

There are two ways to deal with not found routes: the first one is to configure a `defaultRoute` \(and `defaultParams`\), the second one is to allow those not found routes to create a new routing state. Set `allowNotFound` to true and the router will emit a state value for unmatched paths.

For example, if you try to match `/hello-world` and you don't have this route defined, the router will emit the following state:

```javascript
import { constants } from 'router5';

const state = {
    name: constants.UNKNOWN_ROUTE
    params: { path: '/hello-world' },
    path: '/hello-world'
}
```

## URL parameters encoding and decoding

Option `urlParamsEncoding` controls the encoding and decoding of URL parameters, when matching and building paths. It supports the following values:

-   `'default'`: `encodeURIComponent` and `decodeURIComponent` are used but some characters to encode and decode URL parameters, but some characters are preserved when encoding (sub-delimiters:`+`,`:`,`'`,`!`,`,`,`;`,`*`).
-   `'uriComponent'`: use `encodeURIComponent` and `decodeURIComponent` for encoding and decoding URL parameters.
-   `'uri'`: use `encodeURI` and `decodeURI` for encoding and decoding URL parameters.
-   `'none'`: no encoding or decoding is performed
-   `'legacy'`: the approach for version 5.x and below (no longer recommended to use)

## Query parameters mode

Option `queryParamsMode` can take the following values:

-   `'default'`: a path will match with any query parameters added, but when building, extra parameters won't appear in the returned path.
-   `'strict'`: a path with query parameters which were not listed in node definition will cause a match to be unsuccessful. When building, extra parameters won't appear in the returned path.
-   `'loose'`: a path will match with any query parameters added, and when building, extra parameters will appear in the returned path.

## Query parameters formatting

You can specify how array, boolean and null values are formatted in query parameters, and how they are matched.

-   `arrayFormat`: Specifies how arrays should be stringified
    -   `'none'` \(default\): no brackets or indexes are added to query parameter names \(`'role=member&role=admin'`\)
    -   `'brackets`: brackets are added to query parameter names \(`'role[]=member&role[]=admin'`\)
    -   `'index'`: brackets and indexes are added to query parameter names \(`'role[0]=member&role[1]=admin'`\)
-   `booleanFormat`: specifies how boolean values are stringified and parsed
    -   `'none'` \(default\): booleans are stringified to strings \(`'istrue=true&isfalse=false'`\)
    -   `'empty-true'`: same as `'none'` except true values are stringified without value \(`'istrue&isfalse=false'`\). If you choose this boolean format, make sure to change the value of `'nullFormat'`.
    -   `'string'`: same as `'none'` but `'true'` and `'false'` are parsed as booleans
    -   `'unicode'`: `true` and `false` are displayed with unicode characters, and parsed as booleans \(`'istrue=✓&isfalse=✗'`\)
-   `nullFormat`: specifies how null values are stringified and parsed
    -   `'default'` \(default\): null values are stringified without equal sign and value \(`'isnull'`\)
    -   `'string'`: null values are stringified to `'null'` \(`'isnull=null'`\) and parsed as null values
    -   `'hidden'`: null values are not stringified

## Trailing slash mode

Option `trailingSlashMode` can take the following values:

-   `'default'`: building follows path definitions
-   `'never'`: when building, trailing slash is removed
-   `'always'`: when building, trailing slash is added

## Strict trailing slash

By default, the router is not in "strict match" mode. If you want trailing slashes to not be optional, you can set `strictTrailingSlash` to \`true\`\`.

## Automatic clean up

If `autoCleanUp` is set to true, the router will automatically clear `canDeactivate` functions / booleans when their associated segment becomes inactive.

## Case sensitivity

By default, matching of routes is case insensitive. You can set `caseSensitive` to `true` if you want to change that behaviour.
