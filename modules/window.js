function getWindow() {
    try {
        return window
    } catch(e) {
        return null
    }
}

let win = getWindow()

export default win
