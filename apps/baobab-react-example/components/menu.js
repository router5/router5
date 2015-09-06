import {Link} from 'baobab-react-example/router'

export default class Menu extends React.Component {
    render() {
        return (
            <nav>
                <Link routeName="inbox">Inbox</Link>

                <Link routeName="sent">Sent</Link>

                <Link routeName="compose">Compose</Link>

                <Link routeName="drafts">Drafts</Link>
            </nav>
        )
    }
};
