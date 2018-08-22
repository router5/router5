import React from 'react'
import { connect } from 'react-redux'
import InboxList from './InboxList'
import Message from './Message'
import { createRouteNodeSelector } from 'redux-router5'

function Inbox(props) {
    const { route, emails } = props

    return (
        <div className="inbox">
            <InboxList emails={emails} />
            {route.name === 'inbox.message' ? (
                <Message {...emails[route.params.id]} key={route.params.id} />
            ) : null}
        </div>
    )
}

export default connect(createRouteNodeSelector('inbox'))(Inbox)
