import json from '@rollup/plugin-json';
import ts from 'rollup-plugin-ts';
import terser from '@rollup/plugin-terser';

const getPlugins = (includeJson) => {
    const plugins = includeJson
        ? [ json() ]
        : [];
    return [
        ...plugins,
        ts(),
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
            format: 'es'
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