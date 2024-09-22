const tseslint = require('typescript-eslint');
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        languageOptions: {
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                ...globals.browser,
                ...globals.node,
                ...globals.es2020
            }
        }
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true
                }
            ],
            indent: ['error', 4],
            'no-trailing-spaces': [2, { skipBlankLines: true }],
            '@typescript-eslint/no-var-requires': 'off'
        }
    },
    {
        files: ['*.ts', '*.tsx'],
        rules: {
            '@typescript-eslint/ban-types': 'off'
        }
    },
    {
        files: ['*.js'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-require-imports': 'off'
        }
    }
];