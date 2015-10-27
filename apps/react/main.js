import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App';
import { RouterProvider } from 'react-router5';
import router from './router';

router.start(() => {
    ReactDOM.render(
        <RouterProvider router={ router }><App /></RouterProvider>,
        document.getElementById('app')
    );
});
