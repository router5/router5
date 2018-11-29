import { Options, Router } from '../types/router'
export default function withOptions(
    options: Partial<Options>
): (router: Router) => Router
