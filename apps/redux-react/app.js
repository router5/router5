import React from 'react'
import {router} from 'common/router'
import Home from 'redux-react/components/home'

export default class App extends React.Component {
    static components = {
        home: Home
        // users: Users
    }

    state = {
        state: router.getState()
    }

    constructor(props) {
        super(props)
    }

    render() {
        return React.createElement(App.components.home)
    }
}
