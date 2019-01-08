module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    preset: 'ts-jest',
    testPathIgnorePatterns: ['<rootDir>/modules/__tests__/helpers/.*\\.tsx?$'],
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.test.json'
        }
    }
}
