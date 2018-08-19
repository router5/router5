import transitionPath from './transitionPath'

export default function shouldUpdateNode(nodeName) {
    return (toState, fromSate) => {
        const {
            intersection,
            toActivate,
            toDeactivate: toDeactivateReversed
        } = transitionPath(toState, fromSate)

        const toDeactivate = [...toDeactivateReversed].reverse()

        if (toState.meta.options && toState.meta.options.reload) {
            return true
        }

        if (nodeName === intersection) {
            return true
        }

        if (toActivate.indexOf(nodeName) === -1) {
            return false
        }

        let matching = true

        for (let i = 0; i < toActivate.length; i += 1) {
            const activatedSegment = toActivate[i]
            const sameLevelDeactivatedSegment = toDeactivate[i]

            matching = activatedSegment === sameLevelDeactivatedSegment

            if (matching && activatedSegment === nodeName) {
                return true
            }

            if (!matching) {
                return false
            }
        }

        // Should never be reached
        return false
    }
}
