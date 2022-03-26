import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

const getPlugins = (includeJson) => {
    const plugins = includeJson
        ? [
            json()
        ]
        : [];
    return [
        ...plugins,
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            outDir: './'
        }),
        terser({
            output: {
                comments: false
            }
        })
    ];
};

const getConfig = (name, defaults = true) => ({
    input: `src/${name}.ts`,
    external: [
        'postcss',
        'rtlcss'
    ],
    output: [
        {
            file: `dist/${name}.js`,
            format: 'cjs',
            exports: defaults ? 'default' : 'named'
        },
        {
            file: `dist/esm/${name}.js`,
            format: 'es',
            exports: defaults ? 'default' : 'named'
        }
    ]
});

export default [
    {
        plugins: getPlugins(true),
        ...getConfig('index')
    },
    {
        plugins: getPlugins(),
        ...getConfig('options', false)
    }
];