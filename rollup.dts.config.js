import dts from 'rollup-plugin-dts';
import tsconfig from './tsconfig.json';

const getConfig = (name) => ({
    plugins: [
        dts({
            compilerOptions: {
                baseUrl: './dist',
                paths: tsconfig.compilerOptions.paths,
            }
        })
    ],
    input: `dist/${name}.d.ts`,
    output: [
        {
            file: `./${name}.d.ts`
        }
    ]
});

export default [
    getConfig('index'),
    getConfig('options')
];