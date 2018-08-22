import React, { Component } from 'react'
import { Link } from 'react-router5'

function InboxItem({ title, message, id }) {
    return (
        <li>
            <Link
                routeName="inbox.message"
                routeParams={{id }}
                activeClassName="active"
            >
                <h4>{title}</h4>
                <p>{message}</p>
            </Link>
        </li>
    )
}

export default InboxItem
