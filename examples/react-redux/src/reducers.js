import data from './data'

const draftInitialState = {
    title: '',
    message: ''
}

export function draft(state = draftInitialState, action) {
    switch (action.type) {
        case 'UPDATE_TITLE':
            return {
                ...state,
                title: action.title
            }

        case 'UPDATE_MESSAGE':
            return {
                ...state,
                message: action.message
            }

        default:
            return state
    }
}

export function emails(state = data, action) {
    return state
}
