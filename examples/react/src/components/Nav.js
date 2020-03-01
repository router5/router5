import React from 'react'
import { BaseLink, useRoute } from 'react-router5'

function Nav() {
    const { router } = useRoute()

    return (
        <nav>
            <BaseLink
                router={router}
                routeName="inbox"
                routeOptions={{ reload: true }}
            >
                Inbox
            </BaseLink>
            <BaseLink router={router} routeName="compose">
                Compose
            </BaseLink>
            <BaseLink router={router} routeName="contacts">
                Contacts
            </BaseLink>
        </nav>
    )
}

export default Nav
