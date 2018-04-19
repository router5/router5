import React from 'react'
import ReactDOM from 'react-dom'
import { RouteProvider } from 'react-router5'
import { Provider } from 'react-fela'

import App from './components/App'
import createRouter from './router'
import createStyleRenderer from './styleRenderer'

const renderer = createStyleRenderer()
const router = createRouter()

router.start()

ReactDOM.render(
    <Provider renderer={renderer}>
        <RouteProvider router={router}>
            <App />
        </RouteProvider>
    </Provider>,
    document.getElementById('app')
)
