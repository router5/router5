/// <reference path="../../../index.d.ts" />

import createRouter, { loggerPlugin } from 'router5'

const router = createRouter([])
router.usePlugin(loggerPlugin)
