import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { router5Middleware, router5Reducer } from 'redux-router5';

export default function configureStore(router, initialState = {}) {
    const createStoreWithMiddleware = applyMiddleware(router5Middleware(router))(createStore);
    const store = createStoreWithMiddleware(combineReducers({ router: router5Reducer }), initialState);

    window.store = store;
    return store;
}
