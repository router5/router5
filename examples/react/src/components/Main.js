import React from 'react'
import { useRouteNode } from 'react-router5'
import Inbox from './Inbox'
import Compose from './Compose'
import NotFound from './NotFound'

function Main({ emails }) {
    const { route } = useRouteNode('')
    const topRouteName = route.name.split('.')[0]

    if (topRouteName === 'inbox') {
        return <Inbox emails={emails} />
    }

    if (topRouteName === 'compose') {
        return <Compose />
    }

    return <NotFound />
}

export default Main
