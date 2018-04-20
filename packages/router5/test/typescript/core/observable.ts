/// <reference path="../../../index.d.ts" />

import createRouter, { SubscribeFn } from 'router5'

let router = createRouter([])

const subscribeFn: SubscribeFn = ({ route, previousRoute }) => {}
router.subscribe(subscribeFn)
