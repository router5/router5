import element from 'virtual-element'

const InboxItem = {
    propTypes: {
        router: { source: 'router' }
    },

    render({ props }) {
        const { mailTitle, mailMessage, router, id } = props

        return element(
            'li',
            { onClick: () => router.navigate('inbox.message', { id }) },
            [element('h4', {}, mailTitle), element('p', {}, mailMessage)]
        )
    }
}

export default InboxItem
