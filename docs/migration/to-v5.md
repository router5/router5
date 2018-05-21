# Migrating from 4.x to 5.x


With version 5.0.0, `router5` is now a monorepo: all repos have been imported into https://github.com/router5/router5. This will make maintenance and release of new versions easier.

## Bug fixes

Not found state is now passed to middleware functions on start: if you use `allowNotFound` option and have custom middleware functions, make sure they still work.

## Default options

* router `strictQueryParams` option is now `false` by default: if you currently don't specify that option, you need to explicitely set it to `true` to keep the same behaviour.
* browser plugin option `preserveHash` is now `true` by default

## Packages renamed

* `router5.helpers` package has been renamed to `router5-helpers`
* `router5.transition-path` package has been renamed to `router5-transition-path`
