export default {
    displayName: 'Integration',
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    setupFiles: ['./test/integration/src/apiEnvSetup.ts'],
    testMatch: ['**/test/integration/test/**/*.test.ts'],
    modulePathIgnorePatterns: ['<rootDir>/dist'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                useESM: true,
                diagnostics: false
            }
        ]
    }
};
