import React from 'react';
import InboxList from './InboxList';
import Message from './Message';
import { connect } from 'react-redux';
import { routeNodeSelector } from 'redux-router5';

function Inbox(props) {
    const { route } = props;

    return (
        <div className='inbox'>
            <InboxList />
            { route.name === 'inbox.message' ? <Message messageId={ route.params.id } key={ route.params.id } /> : null }
        </div>
    );
}

export default connect((state) => routeNodeSelector('inbox'))(Inbox);
