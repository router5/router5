/// <reference path="../../../index.d.ts" />

import createRouter from "router5";
import listenersPlugin from "router5/plugins/listeners";

const router = createRouter([]);
router.usePlugin(listenersPlugin());

const options = {
    autoCleanUp: true,
};

listenersPlugin();
listenersPlugin(options);
