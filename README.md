# router5-react

> This is a draft, examples below are untested

A few helpers to use [router5](https://github.com/router5/router5) with React and reduce boilerplate code.

__router5-react__ exports two factories, each take a Router5 instance as unique argument:

- linkFactory
- segmentMixinFactory

The reason for using factories is for you to create a `Link` component and a `SegmentMixin` mixin
with access to your router instance. I considered using context, but I prefer to keep components
and mixins as functional as possible.

This makes the use of Router5 with React very flexible, and you can choose how to organise your
code. Below is one example of how you can use those helpers:

```javascript
import {linkFactory, segmentMixinFactory} from 'router5-react'
import Router5 from 'router5'

let router = Router5()
    .addNode('users',      '/users')
    .addNode('users.view', '/view/:id')
    .addNode('users.list', '/list')
    .start()

export {
    Link:         linkFactory(router)
    SegmentMixin: segmentMixinFactory(router)
    router
}
```

### Link component

```javascript
import React from 'react'
import {Link} from './router'

let Link = linkFactory(router)

let Menu = React.createClass({
    render() {
        let params = {id: 1}
        return (<nav>
            <Link routeName="users.view" routeParams={params}>View user 1</Link>

            <Link routeName="users.list">List users</Link>
        </nav>)
    }
})

export Menu
```

### Route segment mixin

This segment will take care of the following:

- Register and deregister component instance with router
- Add and remove route node listener

```javascript
import React from 'react'
import {SegmentMixin} from './router'

import UserView from './user-view'
import UsersList from './users-list'

let UsersComponent = React.createClass({
    mixins: [SegmentMixin('users', (toRoute, fromRoute) => {
        // You can use this, it will be bound to your function in Mixin
        let that = this

        if (toRoute.name === 'users.view') {
            // pseudo-code
            xhr.getUser(1).then((user) => {
                that.setState({route: toRoute, data: user})
            })
        }

        if (toRoute.name === 'users.list') {
            // pseudo-code
            xhr.getUser(1).then((user) => {
                that.setState({route: toRoute, data: users})
            })
        }
    })]

    getInitialState() {
        return {
            route: router.getState()
        }
    },

    canDeactivate() {
        return true
    },

    render() {
        if (this.state.route.name === 'users.view') {
            return <UserView user={this.state.data} />
        }

        if (this.state.route.name === 'users.list') {
            return <UserList users={this.state.data} />
        }
    }
})

export UsersComponent
```
