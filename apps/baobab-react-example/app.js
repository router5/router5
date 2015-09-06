import React from 'react';
import {router} from 'baobab-react-example/router';
import Menu from 'baobab-react-example/components/menu';
import Admin from 'baobab-react-example/components/admin';
import Inbox from 'baobab-react-example/components/inbox';
import Sent from 'baobab-react-example/components/sent';
import Compose from 'baobab-react-example/components/compose';
import Drafts from 'baobab-react-example/components/drafts';
import NotFound from 'baobab-react-example/components/not-found';
import tree from 'baobab-react-example/tree';

import React from 'react'

function classFactory(router) {
    return class RouteNodeComponent extends React.Component {
        constructor(props) {
            super(props);

            this.routeName = RouteNode.routeName || props.routeName || '';
            this.nodeListener = RouteNode.nodeListener.bind(this) || props.nodeListener.bind(this) || noop;
            router.addNodeListener(this.routeName, this.nodeListener);
        }

        componentWillUnmount() {
            router.removeNodeListener(this.routeName, this.nodeListener);
        }
    };
};

function routeNode(routeName, nodeListener) {
    return function routeNameDecorator(target) {
        target.routeName = routeName;
        target.nodeListener = nodeListener;
    };
}

class RouteNodeComponent = classFactory(router);

function nodeListener(toState) {
    this.setState({});
}

@routeNode('', nodeListener)
export default class App extends RouteNodeComponent {
    static components = {
        inbox: Inbox,
        sent: Sent,
        drafts: Drafts,
        compose: Compose,
        admin: Admin,
    }

    constructor(props) {
        super(props);

        this.nodeListener = ;

        router.addNodeListener('', this.nodeListener);
    }

    componentWillUnmount = () => {
        router.removeNodeListener('', this.nodeListener);
    }

    render() {
        let routerState = tree.get('routerState');
        let RouteComponent = (routerState ? App.components[routerState.name] : NotFound) || NotFound;

        return (
            <div>
                <Menu />

                <main>
                    <RouteComponent />
                </main>
            </div>
        );
    }
}
