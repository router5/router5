/// <reference path="../../../index.d.ts" />

import createRouter from 'router5'
import persistentParamsPluginFactory from 'router5/plugins/persistentParams'

const router = createRouter([])
router.usePlugin(persistentParamsPluginFactory())

persistentParamsPluginFactory(['id'])
persistentParamsPluginFactory({ id: 1 })
persistentParamsPluginFactory()
