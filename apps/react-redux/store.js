import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { router5Middleware, router5Reducer } from 'redux-router5';
import emails from './reducers/emails';
import draft from './reducers/draft';
import logger from 'redux-logger';

export default function configureStore(router, initialState = {}) {
    const createStoreWithMiddleware = applyMiddleware(router5Middleware(router), logger())(createStore);
    const store = createStoreWithMiddleware(combineReducers({
        router: router5Reducer,
        emails,
        draft
    }), initialState);

    window.store = store;
    return store;
}
