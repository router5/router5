/// <reference path="../../../index.d.ts" />

import createRouter, { DoneFn, Router, State } from 'router5'

let router = createRouter([])

const handler1 = () => () => true
const handler2 = () => () => Promise.resolve(true)
const handler3 = (_r: Router) => (
    _toState: State,
    _fromState: State,
    done: DoneFn
) => {
    done()
}

router = router.canDeactivate('users.list', handler1)
router = router.canDeactivate('users.list', handler2)
router = router.canDeactivate('users.list', handler3)
router = router.canDeactivate('users.list', true)

router = router.clearCanDeactivate('users.list')

router = router.canActivate('users.list', handler1)
router = router.canActivate('users.list', handler2)
router = router.canActivate('users.list', handler3)
router = router.canActivate('users.list', true)
