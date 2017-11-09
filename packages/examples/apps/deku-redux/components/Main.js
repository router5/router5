import element from 'virtual-element'
import Inbox from './Inbox'
import Compose from './Compose'
import NotFound from './NotFound'
import { connect } from 'deku-redux'
import { routeNodeSelector } from 'redux-router5'

const components = {
    inbox: Inbox,
    compose: Compose
}

const Main = {
    render({ props }) {
        const { route } = props
        const segment = route ? route.name.split('.')[0] : undefined

        return element(components[segment] || NotFound)
    }
}

export default connect(state => routeNodeSelector(''))(Main)
