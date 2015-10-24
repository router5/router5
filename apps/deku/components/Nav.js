import element from 'virtual-element';
import { Link } from 'router5-deku';

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
