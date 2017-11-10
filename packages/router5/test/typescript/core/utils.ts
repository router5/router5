/// <reference path="../../../index.d.ts" />

import createRouter, { State } from 'router5'

let res: boolean

const router = createRouter([])
const state = router.getState()

res = router.isActive('users.show', { id: 1 }, true, false)
res = router.isActive('users.show', { id: 1 }, true)
res = router.isActive('users.show', { id: 1 })
res = router.isActive('users.show')

res = router.areStatesEqual(state, state, false)
res = router.areStatesEqual(state, state)

res = router.areStatesDescendants(state, state)

const _p: string = router.buildPath('users.show', { id: 1 })

let s: State | null
s = router.matchPath('/users', 'popstate')
s = router.matchPath('/users')

router.setRootPath('/')
