const a = {
    name: 'a',
    path: '/a'
};

const b = {
    name: 'b',
    path: '/b'
};

const c = {
    name: 'c',
    path: '/c'
};

export default [
    { ...a, children: [a, b, c] },
    { ...b, children: [a, b, c] }
];
