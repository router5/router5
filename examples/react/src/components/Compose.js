import React, { useEffect, useState } from 'react'

const Compose = () => {
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [warning, setWarning] = useState(false)

    useEffect(() => {
        setWarning(false)
    }, [title, message])

    return (
        <div className="compose">
            <h4>Compose a new message</h4>

            <input
                name="title"
                value={title}
                onChange={evt => setTitle(evt.target.value)}
            />
            <textarea
                name="message"
                value={message}
                onChange={evt => setMessage(evt.target.value)}
            />

            {warning ? <p>Clear inputs before continuing</p> : null}
        </div>
    )
}

export default Compose
