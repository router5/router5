import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'
import { RouteProvider } from 'react-router5'
import createRouter from './create-router'
import emails from './data'
import './style.css'

const router = createRouter()

router.start(() => {
    ReactDOM.render((
        <RouteProvider router={router}>
            <App emails={emails} />
        </RouteProvider>
    ), document.getElementById('root'))
})
