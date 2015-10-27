import React from 'react';

function InboxItem(props) {
    const { mailTitle, mailMessage, onClick } = props;

    return (
        <li onClick={ onClick }>
            <h4>{ mailTitle }</h4>
            <p>{ mailMessage }</p>
        </li>
    );
}

export default InboxItem;
