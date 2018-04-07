import React from 'react'
import InboxList from './InboxList'
import Message from './Message'
import { RouteNode } from 'react-router5'
import { getEmails } from '../api'

function Inbox(props) {
    const { route } = props

    return (
        <div className="inbox">
            <InboxList emails={getEmails()} />
            {route.name === 'inbox.message' ? (
                <Message messageId={route.params.id} key={route.params.id} />
            ) : null}
        </div>
    )
}

export default () => (
    <RouteNode nodeName="inbox">
        {({ route }) => <Inbox route={route} />}
    </RouteNode>
)
