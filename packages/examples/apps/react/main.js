import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'
import { RouterProvider } from 'react-router5'
import createRouter from '../create-router'

const router = createRouter(true)
const app = (
    <RouterProvider router={router}>
        <App />
    </RouterProvider>
)

router.start(() => {
    ReactDOM.render(app, document.getElementById('app'))
})
