import { Options, Router } from '../types/router'

const defaultOptions: Options = {
    trailingSlashMode: 'default',
    queryParamsMode: 'default',
    strictTrailingSlash: false,
    autoCleanUp: true,
    allowNotFound: false,
    strongMatching: true,
    rewritePathOnMatch: true,
    caseSensitive: false,
    urlParamsEncoding: 'default'
}

export default function withOptions<Dependencies>(options: Partial<Options>) {
    return (router: Router<Dependencies>): Router<Dependencies> => {
        const routerOptions = {
            ...defaultOptions,
            ...options
        } as Options

        router.getOptions = () => routerOptions

        router.setOption = (option, value) => {
            routerOptions[option] = value

            return router
        }

        return router
    }
}
