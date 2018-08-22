import React from 'react'
import { RouteNode } from 'react-router5'
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

export default (props) => (
    <RouteNode nodeName="">
        {({ route }) => <Main route={route} {...props} />}
    </RouteNode>
)
