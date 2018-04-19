import React, { Component } from 'react'
import PropTypes from 'prop-types'

class InboxItem extends Component {
    constructor(props, context) {
        super(props, context)

        this.router = context.router
        this.clickHandler = this.clickHandler.bind(this)
    }

    clickHandler() {
        this.router.navigate('inbox.message', { id: this.props.id })
    }

    render() {
        var { mailTitle, mailMessage } = this.props

        return (
            <li onClick={this.clickHandler}>
                <h4>{mailTitle}</h4>
                <p>{mailMessage}</p>
            </li>
        )
    }
}

InboxItem.contextTypes = {
    router: PropTypes.object.isRequired
}

export default InboxItem
