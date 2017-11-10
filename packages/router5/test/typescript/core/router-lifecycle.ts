/// <reference path="../../../index.d.ts" />

import createRouter from 'router5'

let router = createRouter([])

const _: boolean = router.isStarted()

router = router.start('', () => {})
router = router.start('')
router = router.start(() => {})
router = router.start()

router = router.stop()
