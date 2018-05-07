export default [
    { name: 'inbox', path: '/inbox' },
    { name: 'inbox.message', path: '/message/:id' },
    { name: 'compose', path: '/compose' },
    { name: 'contacts', path: '/contacts' },
    { name: 'firefox', path: '/firefox/:query<(\\w{1,}(-|_|%7C|\\|)?)+>' }
]
