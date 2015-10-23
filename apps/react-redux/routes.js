const routes = [
    {
        name: 'home',
        path: '/home',
        label: 'Home'
    },
    {
        name: 'admin',
        path: '/admin',
        canActivate: function canActivateAdmin(toState, fromState, done) {
            setTimeout(done, 200);
        },
        label: 'Admin'
    }
];

export default routes;
