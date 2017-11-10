/// <reference path="../../../index.d.ts" />

import createRouter, { DoneFn, Router, State } from 'router5'

let router = createRouter([])

const middleware1 = () => () => true
const middleware2 = () => () => Promise.resolve(true)
const middleware3 = (_r: Router) => (
    _to: State,
    _from: State,
    done: DoneFn
) => {
    done()
}

router = router.useMiddleware(middleware1, middleware2, middleware3)

router = router.clearMiddleware()
