import element from 'virtual-element'
import InboxItem from './InboxItem'

const InboxList = {
    render({ props }) {
        return element(
            'ul',
            { class: 'mail-list' },
            props.emails.map(mail =>
                element(InboxItem, { ...mail, key: mail.id })
            )
        )
    }
}

export default InboxList
