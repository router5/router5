import React from 'react';
import { connect } from 'react-redux';
import find from 'lodash.find';

function mapStateToProps(state, props) {
    return {
        email: find(state.emails, { id: props.messageId })
    };
}

export default function Message(props) {
    const { mailTitle, mailMessage } = props.email;

    return (
        <section className='mail'>
            <h4>{ mailTitle }</h4>
            <p>{ mailMessage }</p>
        </section>
    );
}

export default connect(mapStateToProps)(Message);
