import element from 'virtual-element';
import Nav from './Nav';
import Main from './Main';

const App = {
    render({ props }) {
        return element('div', {class: 'mail-client'}, [
            element('aside', {}, element(Nav)),
            element('main', {}, element(Main))
        ]);
    }
}

export default App;
