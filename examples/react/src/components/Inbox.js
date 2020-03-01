import React from 'react'
import InboxList from './InboxList'
import Message from './Message'
import { useRouteNode } from 'react-router5'

const Inbox = ({ emails }) => {
    const { route } = useRouteNode('inbox')

    return (
        <div className="inbox">
            <InboxList emails={emails} />
            {route.name === 'inbox.message' ? (
                <Message {...emails[route.params.id]} key={route.params.id} />
            ) : null}
        </div>
    )
}

export default Inbox
