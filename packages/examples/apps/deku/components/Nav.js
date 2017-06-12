import element from 'virtual-element';
import { Link } from 'deku-router5';

const Nav = {
    render({ props }) {
        return element('nav', {}, [
            element(Link, { routeName: 'inbox', routeOptions: { reload: true } }, 'Inbox'),
            element(Link, { routeName: 'compose' }, 'Compose'),
            element(Link, { routeName: 'contacts' }, 'Contacts')
        ]);
    }
};

export default Nav;
