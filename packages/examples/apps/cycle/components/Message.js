import { h, h4, p } from '@cycle/dom'

function Message({ email }) {
    return h('section', { className: 'mail' }, [
        h4(email.mailTitle),
        p(email.mailMessage)
    ])
}

export default Message
