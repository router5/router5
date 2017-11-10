import element from 'virtual-element'
import { connect } from 'deku-redux'
import { createSelector } from 'reselect'
import { updateTitle, updateMessage } from '../actions/draft'

const draftSelector = createSelector(
    state => state.draft,
    state => state.router,
    (draft, router) => ({
        title: draft.title,
        message: draft.message,
        error: hasCannotDeactivateError(router.transitionError)
    })
)

function hasCannotDeactivateError(error) {
    return (
        error &&
        error.code === 'CANNOT_DEACTIVATE' &&
        error.segment === 'compose'
    )
}

const Compose = {
    propTypes: {
        router: { source: 'router' }
    },

    intitalState(props) {
        return { title: '', message: '' }
    },

    render({ state, props }, setState) {
        const {
            title,
            message,
            error,
            updateTitle,
            updateMessage,
            router
        } = props

        const updateState = prop => evt => setState(prop, evt.target.value)
        router.canDeactivate('compose', !title && !message)

        return element('div', { class: 'compose' }, [
            element('h4', {}, 'Compose a new message'),
            element('input', {
                name: 'title',
                value: title,
                onChange: updateState('title')
            }),
            element('textarea', {
                name: 'message',
                value: message,
                onChange: updateState('message')
            }),
            error ? element('p', {}, 'Clear inputs before continuing') : null
        ])
    }
}

export default connect(draftSelector, { updateTitle, updateMessage })(Compose)
