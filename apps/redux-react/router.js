import {Router5} from 'router5'
import {linkFactory, segmentMixinFactory} from 'router5-react'

let router = new Router5([], {
        useHash: true,
        defaultRoute: 'home'
    })
    .addNode('home',      '/home')
    .addNode('users',     '/users')

let Link = linkFactory(router)
let SegmentMixin = segmentMixinFactory(router)

export {router, Link, SegmentMixin}
