const { pathsToModuleNameMapper } = require('ts-jest/utils');
const tsconfig = require('./tsconfig');

module.exports = {
    roots: ['<rootDir>/tests'],
    moduleNameMapper: pathsToModuleNameMapper(
        tsconfig.compilerOptions.paths,
        {
            prefix: '<rootDir>/src'
        }
    ),
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
    ],
    testEnvironment: 'node'
};