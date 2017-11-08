/// <reference path="../../index.d.ts" />

import createRouter, { Route, Router, RouterOptions, State } from "router5";

const routes: Route[] = [
    { name: "home", path: "/" },
    { name: "users", path: "/users/:id" },
];

const options: RouterOptions = {
    defaultRoute: "home",
    defaultParams: { lang: "en" },
    trailingSlash: false,
    useTrailingSlash: false,
    autoCleanUp: true,
    strictQueryParams: true,
    allowNotFound: true,
};

const deps = { store: {} };

const router = createRouter([]);

let r: Router;
r = createRouter(routes);
r = createRouter(routes, options);
r = createRouter(routes, { trailingSlash: true, strictQueryParams: true });
r = createRouter(routes, options, deps);

let s: State;
s = router.makeState("home", {}, "/");
s = router.makeState("home", {}, "/", {});
s = router.makeState("home", {}, "/", {}, "");

s = router.makeNotFoundState("/");

s = router.getState();

router.setState(s);

const _o: RouterOptions = router.getOptions();

r = router.setOption("defaultRoute", "home");
r = router.setOption("defaultParams", { lang: "en" });
r = router.setOption("strictQueryParams", true);

r = router.setDependency("store", {});
r = router.setDependency("counter", 0);
r = router.setDependency("foo", "bar");

r = router.setDependencies(deps);

const _d: object = router.getDependencies();

r = router.add(routes);

router.addNode("home", "/");
router.addNode("home", "/", () => () => true);
