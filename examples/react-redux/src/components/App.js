import React from 'react'
import { connect } from 'react-redux'
import Nav from './Nav'
import Main from './Main'

export default function App({ emails }) {
    return (
        <div className="mail-client">
            <aside>
                <Nav />
            </aside>

            <main>
                <Main emails={emails} />
            </main>
        </div>
    )
}

export default connect(state => ({
  emails: state.emails
}))(App)