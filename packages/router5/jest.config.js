module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js'],
    preset: 'ts-jest',
    testPathIgnorePatterns: ['<rootDir>/modules/__tests__/helpers/.*\\.ts$'],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.test.json'
        }
    }
}
