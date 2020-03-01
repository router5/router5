import createRouter, { Route } from '../../'

const routes: Route[] = [
    {
        name: 'users',
        path: '/users',
        children: [
            {
                name: 'view',
                path: '/view/:id'
            },
            {
                name: 'list',
                path: '/list'
            }
        ]
    },
    {
        name: 'orders',
        path: '/orders',
        children: [
            { name: 'view', path: '/view/:id' },
            { name: 'pending', path: '/pending' },
            { name: 'completed', path: '/completed' }
        ]
    },
    {
        name: 'section',
        path: '/:section<section[\\d]+>',
        children: [
            { name: 'view', path: '/view/:id' },
            { name: 'query', path: '/query?param1&param2&param3' }
        ]
    },
    {
        name: 'profile',
        path: '/profile',
        children: [
            { name: 'me', path: '/' },
            { name: 'user', path: '/:userId' }
        ]
    },
    {
        name: 'withDefaultParam',
        path: '/with-default/:param',
        defaultParams: {
            param: 'hello'
        }
    },
    {
        name: 'withEncoder',
        path: '/encoded/:param1/:param2',
        encodeParams: ({ one, two }) => ({
            param1: one,
            param2: two
        }),
        decodeParams: ({ param1, param2 }) => ({
            one: param1,
            two: param2
        })
    }
]

export default function createTestRouter(options?: any) {
    return createRouter(routes, {
        defaultRoute: 'home',
        ...options
    })
        .addNode('index', '/')
        .addNode('home', '/home')
        .addNode('admin', '/admin', () => () => false)
        .addNode('sign-in', '/sign-in')
        .addNode('auth-protected', '/auth-protected', () => () =>
            new Promise((resolve, reject) =>
                reject({ redirect: { name: 'sign-in' } })
            )
        )
}
