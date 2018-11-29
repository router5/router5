import { Router, Dependencies } from '../types/router'
export default function withDependencies(
    dependencies: Dependencies
): (router: Router) => Router
