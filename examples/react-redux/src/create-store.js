import { createStore, applyMiddleware, combineReducers } from 'redux'
import { router5Middleware, router5Reducer } from 'redux-router5'
import { emails, draft } from './reducers'
import { createLogger } from 'redux-logger'

export default function configureStore(router, initialState = {}) {
    const createStoreWithMiddleware = applyMiddleware(
        router5Middleware(router),
        createLogger()
    )(createStore)

    const store = createStoreWithMiddleware(
        combineReducers({
            router: router5Reducer,
            emails,
            draft
        }),
        initialState
    )

    window.store = store
    return store
}
