import React from 'react'
import InboxItem from './InboxItem'

export default function InboxList(props) {
    return (
        <ul className="mail-list">
            {props.emails.map(mail => <InboxItem {...mail} key={mail.id} />)}
        </ul>
    )
}
