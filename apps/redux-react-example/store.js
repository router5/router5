import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import routerReducer from './reducers/router';

export default function configureStore(initialState = {}) {
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    const store = createStoreWithMiddleware(combineReducers({ router: routerReducer }), initialState);

    window.store = store;
    return store;
}
