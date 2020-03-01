import React from 'react'
import InboxItem from './InboxItem'

export default function InboxList({
  emails
}) {
    return (
        <ul className="mail-list">
            {Object.values(emails).map(mail => <InboxItem {...mail} key={mail.id} />)}
        </ul>
    )
}
