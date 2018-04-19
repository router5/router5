import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { bindActionCreators } from 'redux'
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateTitle, updateMessage }, dispatch)
}

class Compose extends Component {
    constructor(props, context) {
        super(props, context)
        this.router = context.router
    }

    render() {
        const { title, message, error, updateTitle, updateMessage } = this.props
        this.router.canDeactivate('compose', !title && !message)

        return (
            <div className="compose">
                <h4>Compose a new message</h4>

                <input
                    name="title"
                    value={title}
                    onChange={evt => updateTitle(evt.target.value)}
                />
                <textarea
                    name="message"
                    value={message}
                    onChange={evt => updateMessage(evt.target.value)}
                />

                {error ? <p>Clear inputs before continuing</p> : null}
            </div>
        )
    }
}

Compose.contextTypes = {
    router: PropTypes.object.isRequired
}

export default connect(draftSelector, mapDispatchToProps)(Compose)
