import jsdom from 'jsdom';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.use(sinonChai);

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.navigator = win.navigator;

export function omitMeta(obj) {
    return {
        name: obj.name,
        params: obj.params,
        path: obj.path
    };
}
