import {Link} from 'baobab-react-example/router'

export default class Menu extends React.Component {
    render() {
        return (
            <nav>
                <Link routeName="home">Home</Link>

                <Link routeName="admin">Admin</Link>
            </nav>
        )
    }
};
