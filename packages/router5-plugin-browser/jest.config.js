module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js'],
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.test.json'
        }
    }
}
