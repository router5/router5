import { State } from './transitionPath'
export default function shouldUpdateNode(
    nodeName: string
): (toState: State, fromSate: State) => boolean
