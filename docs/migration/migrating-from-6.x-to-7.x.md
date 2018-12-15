# Migrating from 6.x to 7.x

router5 is three and a half years old, and a few things have changed since the start! This year (2018), we went from 2,000 downloads a week to 10,000 downloads a week, so thank you! It gave me the motivation to perform a complete refactor with a necessary modernisation of all packages, something I had procrastinated over for a while. I'm always happy to know more about users of router5, so come and say I: [who is using router5?](https://github.com/router5/router5/issues/161).

With version 7, all packages have been rewritten in TypeScript, and tooling is now consistent across packages. A few breaking changes have been introduced.

## No longer maintained packages

An `unmaintained` directory has been created to move packages which are no longer maintained. `deku-router5` has been added to it: if you are interested in maintaining it, I'm happy to consider transferring ownership.

## Changes per package

### router5

#### Features

- Plugins now accept a `teardown` method (alongside `onStart`, `onStop`, `onTransitionSuccess`, etc.): it will be called when a plugin is removed.

#### BREAKING CHANGES

- Plugins previously included with the router5 package (browser plugin, logger plugin, listeners plugin and persistent params plugin) have been moved to their own packages:
    - `router5-plugin-browser`
    - `router5-plugin-logger`
    - `router5-plugin-listeners`
    - `router5-plugin-persistent-params`
- `usePlugin` no longer returns your router instance, but a teardown function to remove plugins. You can still pass multiple plugins, in which case calling the teardown function will remove all plugins.
- Cloning is now done using a `cloneRouter` function, and it no longer re-uses existing dependencies
    ```js
    import { cloneRouter } from 'router5'

    const clonedRouter = cloneRouter(router, dependencies)
    ```
- When `reload` navigate option is set to `true`, `fromState` is no longer set to `null`: `transitionPath` has been updated to take into account this change, if you have middleware or plugins with custom logic, make sure you update them.

### react-router5

#### Features

- Hooks have been added: `useRoute`, `useRouteNode` and `useRouter`

#### BREAKING CHANGES 

- `Link` has been renamed to `ConnectedLink`, and `BaseLink` has been renamed to `Link`
- `RouteProvider` has been renamed to `RouterProvider`: there is now only one provider
- `react-router5` now requires React version 16.3.0 or above: it no longer uses the old context API. The migration path is quite easy:
    - If you are not using React 16.3.0 (or above), and cannot upgrade to it, a new package `react-router5-hocs` has been added: it is a drop-in replacement for `react-router5` (Link component names stil need changed, see point above)
    - If you are using React 16.3.0 and above, you are good to continue using `react-router5` (see breaking changes above)

### redux-router5

#### BREAKING CHANGES

- For use with immutable.js, use `redux-router5-immutable`

### router5-helpers

#### BREAKING CHANGES

- Undocumented `redirect` helper has been removed: it's no longer needed with `forwardTo`.
