import { ul, li, a, h4, p } from '@cycle/dom';

function InboxList({ emails, buildUrl }) {
    return ul({ className: 'mail-list' }, [
        emails.map(({ id, mailTitle, mailMessage }) => li(
            a({ href: buildUrl('inbox.message', { id }) }, [
                h4(mailTitle),
                p(mailMessage)
            ])
        ))
    ]);
}

export default InboxList;
