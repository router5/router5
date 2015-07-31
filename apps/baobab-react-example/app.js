import React from 'react';
import {router} from 'baobab-react-example/router';
import Menu from 'baobab-react-example/components/menu';
import Admin from 'baobab-react-example/components/admin';
import Home from 'baobab-react-example/components/home';
import NotFound from 'baobab-react-example/components/not-found';
import tree from 'baobab-react-example/tree';

export default class App extends React.Component {
    static components = {
        home: Home,
        admin: Admin
    }

    constructor(props) {
        super(props);

        this.nodeListener = toState => {
            this.setState({});
        };

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
