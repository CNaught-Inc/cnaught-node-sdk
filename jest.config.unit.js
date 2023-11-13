export default {
    displayName: 'Unit',
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    setupFiles: ['./test/unit/setup.ts'],
    testMatch: ['**/test/unit/**/*.spec.ts'],
    testPathIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                diagnostics: false
            }
        ]
    }
};
