/// <reference path="../../../index.d.ts" />

import createRouter, { Plugin, PluginFactory, Router } from 'router5'

const noopPluginFactory: PluginFactory = Object.assign(
    (router: Router): Plugin => {
        return {
            onStart() {},
            onStop() {},
            onTransitionStart() {},
            onTransitionCancel() {},
            onTransitionError() {},
            onTransitionSuccess() {}
        }
    },
    { pluginName: 'NOOP_PLUGIN' }
)

let router = createRouter([])

router = router.usePlugin()
router = router.usePlugin(noopPluginFactory)
router = router.usePlugin(noopPluginFactory, noopPluginFactory)

const _: boolean = router.hasPlugin('NOOP_PLUGIN')
