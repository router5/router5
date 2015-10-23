import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'router5-react';
import ReactDOM from 'react-dom';
import App from './app';
import createRouter from './create-router'
import routes from './routes';
import configureStore from './store';

const router = createRouter(routes);
const store = configureStore({});

router.start((err, state) => {
    const wrappedApp = (
        <Provider store={ store } >
            <RouterProvider router= { router }>
                <App />
            </RouterProvider>
        </Provider>
    );

    ReactDOM.render(wrappedApp, document.getElementById('app'));
})
