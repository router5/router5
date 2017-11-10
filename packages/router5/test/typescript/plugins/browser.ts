/// <reference path="../../../index.d.ts" />

import createRouter, { State } from 'router5'
import browserPlugin, { Options } from 'router5/plugins/browser'

const router = createRouter([])
router.usePlugin(browserPlugin())

const options: Options = {
    forceDeactivate: true,
    useHash: false,
    hashPrefix: '',
    base: '',
    mergeState: false,
    preserveHash: true
}

browserPlugin()
browserPlugin(options)
browserPlugin({ useHash: true })

const _u: string = router.buildUrl('users.show', { id: 1 })

const _p: string = router.urlToPath('https://localhost/users/1')

const _m: State | null = router.matchUrl('https://localhost/users/1')
