/// <reference path="../../../index.d.ts" />

import createRouter, { State } from "router5";
import browserPlugin from "router5/plugins/browser";

const router = createRouter([]);
router.usePlugin(browserPlugin({}));

const options = {
    forceDeactivate: true,
    useHash: false,
    hashPrefix: "",
    base: "",
    mergeState: false,
    preserveHash: true,
};

browserPlugin({});
browserPlugin(options);
browserPlugin({ useHash: true });
