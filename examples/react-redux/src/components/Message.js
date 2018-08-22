import React from 'react'

export default function Message(props) {
    const { title, message } = props

    return (
        <section className="mail">
            <h4>{title}</h4>
            <p>{message}</p>
        </section>
    )
}
