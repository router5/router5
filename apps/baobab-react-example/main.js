import React from 'react'
import {router} from 'baobab-react-example/router'
import App from 'baobab-react-example/app'
import tree from 'baobab-react-example/tree'

router.onTransition(function (toState, fromState, done) {
    tree.set('routerState', toState);
    tree.commit();
    done(null);
});

router.start((err, state) => {
    React.render(<App/>, document.getElementById('app'));
});
