import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router5';
import ReactDOM from 'react-dom';
import App from './components/App';
import createRouter from '../create-router'
import configureStore from './store';

const router = createRouter();
const store = configureStore(router);
const wrappedApp = (
    <Provider store={ store } >
        <RouterProvider router= { router }>
            <App />
        </RouterProvider>
    </Provider>
);

router.start((err, state) => {
    ReactDOM.render(wrappedApp, document.getElementById('app'));
});
