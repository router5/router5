/// <reference path="../../../router5/index.d.ts" />
/// <reference path="../../index.d.ts" />

import transitionPath, {
    nameToIDs,
    TransitionPath,
    shouldUpdateNode
} from 'router5-transition-path'

const _ids: string[] = nameToIDs('a.b.c')

let tp: TransitionPath
tp = transitionPath(
    { name: 'a.b.c', params: {}, path: '/a/b/c' },
    { name: 'a.b.d', params: {}, path: '/a/b/d' }
)
tp = transitionPath({ name: 'a.b.c', params: {}, path: '/a/b/c' })

let shouldUpdate = shouldUpdateNode('a')(
    { name: 'a.b.c', params: {}, path: '/a/b/c' },
    { name: 'a.b.d', params: {}, path: '/a/b/d' }
)
shouldUpdate = shouldUpdateNode('a')({
    name: 'a.b.c',
    params: {},
    path: '/a/b/c'
})
