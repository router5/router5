import { JSDOM } from 'jsdom';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.use(sinonChai);

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.document = window.doc;
global.window = window;
global.navigator = window.navigator;

export function omitMeta(obj) {
    return {
        name: obj.name,
        params: obj.params,
        path: obj.path
    };
}
