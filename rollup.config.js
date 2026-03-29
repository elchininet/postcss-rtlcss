import json from '@rollup/plugin-json';
import ts from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import terser from '@rollup/plugin-terser';

const plugins = [
    ts(),
    terser({
        output: {
            comments: false
        }
    })
];

const dtsPlugins = [
    tsConfigPaths(),
    dts()
];

const external = [
    'postcss',
    'rtlcss'
];

const getConfig = (name, includeJson, exportsDefault) => {
    return [
        {
            plugins: [
                ...(
                    includeJson
                        ? [ json() ]
                        : []
                ),
                ...plugins
            ],
            input: `src/${name}.ts`,
            external,
            output: [
                {
                    file: `dist/${name}.js`,
                    format: 'cjs',
                    exports: exportsDefault ? 'default' : 'named'
                },
                {
                    file: `dist/esm/${name}.js`,
                    format: 'es'
                }
            ]
        },
        {
            plugins: dtsPlugins,
            input: `src/${name}.ts`,
            external,
            output: [
                {
                    file: `dist/${name}.d.ts`,
                    format: 'cjs',
                    exports: exportsDefault ? 'default' : 'named'
                },
                {
                    file: `dist/esm/${name}.d.ts`,
                    format: 'es'
                }
            ]
        }
    ];
};

export default [
    ...getConfig('index', true, true),
    ...getConfig('options', false, false),
];