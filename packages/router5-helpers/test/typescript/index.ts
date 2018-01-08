/// <reference path="../../../router5/index.d.ts" />
/// <reference path="../../index.d.ts" />

import createRouter, { State } from 'router5'
import {
    redirect,
    startsWithSegment,
    endsWithSegment,
    includesSegment
} from 'router5-helpers'

const router = createRouter([])
const state: State = { name: 'a.b', params: {}, path: '/a/b' }

redirect('a', 'b', {})
redirect('a')('b', {})
redirect('a', 'b')
redirect('a')('b')

redirect('a', 'b', {})
redirect('a', 'b')(router)(state, null, () => {})

let res: boolean

res = startsWithSegment('a.b', 'a')
res = startsWithSegment(state, 'a')
res = startsWithSegment('a.b')('a')
res = startsWithSegment(state)('a')

res = endsWithSegment('a.b', 'a')
res = endsWithSegment(state, 'a')
res = endsWithSegment('a.b')('a')
res = endsWithSegment(state)('a')

res = includesSegment('a.b', 'a')
res = includesSegment(state, 'a')
res = includesSegment('a.b')('a')
res = includesSegment(state)('a')
