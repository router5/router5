import {Router5} from 'router5'
import {linkFactory, segmentMixinFactory} from 'router5-react'
import routes from 'routes'
import createRouter from 'common/create-router'

let router = createRouter(routes)

router.onTransition((toState, fromState, done) => {
    done(null)
})

let Link = linkFactory(router)
let SegmentMixin = segmentMixinFactory(router)

export {router, Link, SegmentMixin}
