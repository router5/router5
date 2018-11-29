import { Router, CreateRouter } from '../types/router'
export default function withCloning(
    createRouter: CreateRouter
): (router: Router) => Router
