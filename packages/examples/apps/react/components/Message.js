import React from 'react'
import { getEmail } from '../api'

export default function Message(props) {
    const { mailTitle, mailMessage } = getEmail(props.messageId)

    return (
        <section className="mail">
            <h4>{mailTitle}</h4>
            <p>{mailMessage}</p>
        </section>
    )
}
