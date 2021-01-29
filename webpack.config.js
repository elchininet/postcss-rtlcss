const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const tsconfig = require('./tsconfig');

const { compilerOptions: { baseUrl, paths } } = tsconfig;
const aliasReg = (str) => str.replace(/^(.*)\/\*$/, '$1');

module.exports = {    
    mode: 'production',
    entry: {
        index: './src/index.ts',
        options: './src/options.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        library: 'postcss-rtlcss',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        alias: Object.keys(paths).reduce(
            (obj, a) => (obj[aliasReg(a)] = path.resolve(__dirname, aliasReg(`${baseUrl}/${paths[a]}`)), obj),
            {}
        )
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            }
        ]
    },
    externals: {
        'postcss': 'commonjs postcss'
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};