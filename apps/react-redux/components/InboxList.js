import React from 'react';
import InboxItem from './InboxItem';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from 'redux-router5';

function InboxList({ emails, navigateTo }) {
    return (
        <ul className='mail-list'>
            { emails.map(mail => <InboxItem {...mail} key={mail.id} onClick={ () => navigateTo('inbox.message', { id: mail.id }) } />) }
        </ul>
    );
}

export default connect(
    state => ({ emails: state.emails }),
    dispatch => bindActionCreators({ navigateTo: actions.navigateTo }, dispatch)
)(InboxList);
