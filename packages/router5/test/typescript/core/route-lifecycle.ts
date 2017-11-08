/// <reference path="../../../index.d.ts" />

import createRouter, { Router, State } from "router5";

let router = createRouter([]);

const handler1 = () => () => true;
const handler2 = () => () => Promise.resolve(true);

router = router.canDeactivate("users.list", handler1);
router = router.canDeactivate("users.list", handler2);
router = router.canDeactivate("users.list", true);

router = router.canActivate("users.list", handler1);
router = router.canActivate("users.list", handler2);
router = router.canActivate("users.list", true);
