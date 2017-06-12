import React, { createElement } from 'react';
import { routeNode } from 'react-router5';
import Inbox from './Inbox';
import Compose from './Compose';
import NotFound from './NotFound';

const components = {
    'inbox':   Inbox,
    'compose': Compose
};

function Main(props) {
    const { route } = props;
    const segment = route.name.split('.')[0];

    return createElement(components[segment] || NotFound);
}

export default routeNode('')(Main);
