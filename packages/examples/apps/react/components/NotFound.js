import React, { Fragment } from 'react'

export default function NotFound(props) {
    return (
        <Fragment>
            <h3>Not found</h3>
            <div className="not-found">
                Purposely Not found (not a bug)
                <p>{JSON.stringify(props)}</p>
            </div>
        </Fragment>
    )
}
