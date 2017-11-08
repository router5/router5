/// <reference path="../../../index.d.ts" />

import createRouter from "router5";

const router = createRouter([]);

router.cancel();

router.forward("/", "home");

router.navigate("/home", { lang: "en" }, { replace: true }, () => true);
router.navigate("/home", { lang: "en" }, { replace: true });
router.navigate("/home", { lang: "en" });
router.navigate("/home", () => true);
router.navigate("/home");

router.navigateToDefault({ replace: true }, () => true);
router.navigateToDefault();
