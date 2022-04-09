module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        quotes: ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
        semi: ['error', 'always'],
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        'no-trailing-spaces': [2, { skipBlankLines: true }]
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off'
            }
        }
    ]
};