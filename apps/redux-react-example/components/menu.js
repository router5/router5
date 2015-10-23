import React from 'react';
import routes from '../routes';
import { Link } from 'router5-react';

export default function Menu(props) {
    return (
        <nav>
            {
                routes.map(route => <Link routeName={ route.name } routeParams={ route.params } key={ route.name }>{ route.label }</Link>)
            }
        </nav>
    );
}
