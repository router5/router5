const routes = [
    {
        name: 'inbox',
        path: '/inbox'
    },
    {
        name: 'sent',
        path: '/sent'
    },
    {
        name: 'drafts',
        path: '/drafts',
    },
    {
        name: 'compose',
        path: '/compose'
    },
    {
        name: 'admin',
        path: '/admin',
        canActivate: function canActivateAdmin(toState, fromState, done) {
            setTimeout(function () {
                done(null);
            }, 200);
        }
    }
]

export default routes
