import React from 'react'

import { Route, BaseLink } from 'react-router5'

export default function AppMenu() {
    return (
        <Route>
            {() => (
                <nav>
                    <BaseLink routeName="home">Home</BaseLink>

                    <BaseLink routeName="gettingStarted">
                        Getting started
                    </BaseLink>
                </nav>
            )}
        </Route>
    )
}
