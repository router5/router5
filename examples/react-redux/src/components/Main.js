import React from 'react'
import { connect } from 'react-redux'
import { createRouteNodeSelector } from 'redux-router5'
import Inbox from './Inbox'
import Compose from './Compose'
import NotFound from './NotFound'

function Main({ route, emails }) {
    const topRouteName = route.name.split('.')[0]

    if (topRouteName === 'inbox') {
        return <Inbox emails={emails} />
    }

    if (topRouteName === 'compose') {
        return <Compose />
    }

    return <NotFound />
}

export default connect(createRouteNodeSelector(''))(Main)
