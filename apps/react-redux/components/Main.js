import React, { createElement } from 'react';
import { connect } from 'react-redux';
import { routeNodeSelector } from 'redux-router5';
import Inbox from './Inbox';
import Compose from './Compose';
import NotFound from './NotFound';

const components = {
    'inbox':   Inbox,
    'compose': Compose
};

function Main(props) {
    const { route } = props;
    const segment = route ? route.name.split('.')[0] : undefined;

    return createElement(components[segment] || NotFound);
}

export default connect(routeNodeSelector(''))(Main);
