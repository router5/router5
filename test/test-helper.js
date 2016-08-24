import jsdom from 'jsdom';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(sinonChai);
chai.use(chaiEnzyme());

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.navigator = win.navigator;
