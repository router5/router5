import element from 'virtual-element'
import { getEmail } from '../api'

const Message = {
    render({ props }) {
        const { mailTitle, mailMessage } = getEmail(props.messageId)

        return element('section', { class: 'mail' }, [
            element('h4', {}, mailTitle),
            element('p', {}, mailMessage)
        ])
    }
}

export default Message
