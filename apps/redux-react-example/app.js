import React, { Component, createElement } from 'react';
import Home from './components/home';
import Admin from './components/admin';
import Menu from './components/menu';
import { routeNode } from 'router5-react';

const components = {
    home: Home,
    admin: Admin
};

class App extends Component {
    render() {
        const { route } = this.props;
        return (
            <div>
                <Menu />
                { createElement(components[route.name]) }
            </div>
        );
    }
}

export default routeNode('')(App);
