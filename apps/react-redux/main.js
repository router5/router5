import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'router5-react';
import ReactDOM from 'react-dom';
import App from './components/App';
import createRouter from './create-router'
import configureStore from './store';

const router = createRouter();

router.start((err, state) => {
    const store = configureStore(router, { router: { route: state }});

    const wrappedApp = (
        <Provider store={ store } >
            <RouterProvider router= { router }>
                <App />
            </RouterProvider>
        </Provider>
    );

    ReactDOM.render(wrappedApp, document.getElementById('app'));
});
