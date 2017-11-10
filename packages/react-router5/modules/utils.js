export const getDisplayName = component =>
    component.displayName || component.name || 'Component'

export const ifNot = (condition, errorMessage) => {
    if (!condition) throw new Error(errorMessage)
}
