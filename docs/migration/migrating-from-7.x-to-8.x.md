# Migrating from 7.x to 8.x

It is now more than 5 years that I started this project, and in a few months it will be 5 years since the first public release. Over the years there has been major changes regarding tooling and languages (from multi repo to monorepo, from multi packages to one package back to multi packagees, from babel to rollup, from JavScript to TypeScript, from mocha to jest, from eslint to tslint back to eslint, etc.). Also in the last 5 years there has been a lot of changes in my personal life (positive ones, like my family growing!). I've had less time and less desire to maintain this project. After a year of inactivity, I'm finally back on it.

Version 8 is a global maintenance of `router5` and its dependencies. I'm putting things in place to lessen maintainance work. It includes all sub dependencies I am the owner of: `search-params`, `path-parser` and `route-node`.

## No longer maintained packages

`react-router5-hocs` has a new version published but won't be maintained any further.

## Changes per package

### router5

#### Features

-   `createRouter` takes a generic for typing dependencies (also it is advised to let it be inferred). This will help for more type safetiness and developer experience in places where dependencies are injected.

-   A new option `urlParamsEncoding` has been added to be able to choose how URL params are encoded and decoded by default when matching and building. See the options documentation for more info.

#### BREAKING CHANGES

-   Now by default URL params encoding can be different dependending on what special characters you use in them. The default value is pretty safe but if you want to keep the old behaviour, set `urlParamsEncoding` to `'legacy'`.

### Other packages

Other packages have been maintained and a new version has been published.
