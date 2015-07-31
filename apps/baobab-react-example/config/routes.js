const routes = [
    {
        name: 'home',
        path: '/home'
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
