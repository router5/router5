import element from 'virtual-element'
import Link from './Link'
import { connect } from 'deku-redux'
import { actions } from 'redux-router5'

const Nav = {
    propTypes: {
        router: { source: 'router' }
    },

    render({ props }) {
        const { router, navigateTo } = props

        return element('nav', {}, [
            element(
                Link,
                {
                    router,
                    navigateTo,
                    name: 'inbox',
                    options: { reload: true }
                },
                'Inbox'
            ),
            element(Link, { router, navigateTo, name: 'compose' }, 'Compose'),
            element(Link, { router, navigateTo, name: 'contacts' }, 'Contacts')
        ])
    }
}

export default connect(state => state.router.route, {
    navigateTo: actions.navigateTo
})(Nav)
