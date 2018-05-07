import React, { Fragment } from 'react'
import { routeNode } from 'react-router5'

function Firefox(props) {
    const { route } = props
    const { name } = route
    const { query } = route.params
    return (
        <Fragment>
            <h3>{name}</h3>
            <p>{query}</p>
        </Fragment>
    )
}

export default routeNode('firefox')(Firefox)
