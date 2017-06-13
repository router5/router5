import { JSDOM } from 'jsdom';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(sinonChai);
chai.use(chaiEnzyme());

const { window } = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});

global.document = window.document;
global.window = window;
global.navigator = window.navigator;
