export function updateTitle(title) {
    return {
        type: 'UPDATE_TITLE',
        title
    }
}

export function updateMessage(message) {
    return {
        type: 'UPDATE_MESSAGE',
        message
    }
}
