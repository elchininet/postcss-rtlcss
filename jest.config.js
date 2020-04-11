const tsconfig = require('./tsconfig');

const { compilerOptions: { paths } } = tsconfig;
const reg = /^(.*)\/\*$/;
const aliasReg = (str) => str.replace(reg, '$1');

const aliases = Object.keys(paths).reduce(
    (obj, a) => {
        if (reg.test(a)) {
            obj[`^${aliasReg(a)}/(.*)$`] = `<rootDir>/src/${aliasReg(paths[a][0])}/$1`;
        } else {
            obj[`^${a}$`] = `<rootDir>/src/${paths[a][0]}`;
        }
        return obj;
    },
    {}
);

module.exports = {
    roots: ['<rootDir>/tests'],
    moduleNameMapper: aliases,
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
    ]
};