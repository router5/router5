import element from 'virtual-element';
import { routeNode } from 'router5-deku';

const Compose = {
    intitalState(props) {
        return { title: '', message: '' };
    },

    render({ state }, setState) {
        const { title, message } = state;

        const updateState = prop => evt => setState(prop, evt.target.value);

        return element('div', { class: 'compose' }, [
            element('h4', {}, 'Compose a new message'),
            element('input', { name: 'title', value: title, onChange: updateState('title') }),
            element('textarea', { name: 'message', value: message, onChange: updateState('message') })
        ]);
        // { warning ? <p>Clear inputs before continuing</p> : null }
    }
};

export default routeNode('compose')(Compose);
