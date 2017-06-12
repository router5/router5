import element from 'virtual-element';

const NotFound = {
    render() {
        return element('div', { class: 'not-found' }, 'Purposely not found (not a bug)');
    }
};

export default NotFound;
