/// <reference path="../../../index.d.ts" />

import createRouter, { CancelFn } from 'router5'

let router = createRouter([])

router = router.cancel()

router = router.forward('/', 'home')

let cancel: CancelFn
cancel = router.navigate('/home', { lang: 'en' }, { replace: true }, () => true)
cancel = router.navigate('/home', { lang: 'en' }, { replace: true })
cancel = router.navigate('/home', { lang: 'en' }, () => true)
cancel = router.navigate('/home', { lang: 'en' })
cancel = router.navigate('/home', () => true)
cancel = router.navigate('/home')

cancel = router.navigateToDefault({ replace: true }, () => true)
cancel = router.navigateToDefault(() => true)
cancel = router.navigateToDefault()
