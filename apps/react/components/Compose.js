import React, { Component } from 'react';
import { routeNode } from 'react-router5';

class Compose extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            title: undefined,
            message: undefined
        };
        this.updateTitle = this.updateTitle.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.canDeactivate = this.canDeactivate.bind(this);
    }

    canDeactivate() {
        if (this.state.title || this.state.message) {
            this.setState({ warning: true })
            return false;
        }

        return true;
    }

    updateTitle(evt) {
        this.setState({title: evt.target.value, warning: false});
    }

    updateMessage(evt) {
        this.setState({message: evt.target.value, warning: false});
    }

    render() {
        const {title, message, warning} = this.state;

        return (
            <div className='compose'>
                <h4>Compose a new message</h4>

                <input name='title' value={ title } onChange={ this.updateTitle } />
                <textarea name='message' value={ message } onChange={ this.updateMessage } />

                { warning ? <p>Clear inputs before continuing</p> : null }
            </div>
        );
    }
}

export default routeNode('compose', true)(Compose);
