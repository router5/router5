import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'
import { RouteProvider } from 'react-router5'
import createRouter from '../create-router'

const router = createRouter(false)
const app = (
    <RouteProvider router={router}>
        <App />
    </RouteProvider>
)

router.start(() => {
    ReactDOM.render(app, document.getElementById('app'))
})
