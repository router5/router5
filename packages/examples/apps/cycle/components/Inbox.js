import Rx from 'rx';
import { h, div } from '@cycle/dom';
import InboxList from './InboxList';
import Message from './Message';

function Inbox(sources) {
    const emails$ = Rx.Observable.combineLatest(
        sources.router.routeNode$('inbox'),
        sources.data.emails$,
        (route, emails) => {
            const email = route.name === 'inbox.message'
                ? emails.find(({ id }) => id === route.params.id)
                : null;

            return { emails, email };
        }
    );

    const inbox$ = emails$
        .map(({ emails, email }) => {
            const inboxList = InboxList({ emails, buildUrl: sources.router.buildUrl });
            const message = email && Message({ email });

            return div({ className: 'inbox' }, [
                inboxList,
                message
            ]);
        });

    return {
        DOM: inbox$
    };
};

export default Inbox;
