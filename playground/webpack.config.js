const path = require('path');
const aliases = require('./aliases');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {    
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        filename: 'scripts/index.js',
        path: path.resolve(__dirname, '../docs')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: aliases
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'PostCSS-RTLCSS Playground',
            fav32: 'images/favicon-32x32.png',
            fav192: 'images/favicon-192x192.png',
            fav180: 'images/favicon-180x180.png',
            fav270: 'images/favicon-270x270.png',
            template: './demo.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'images', to: 'images' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/styles.css'
        }),
        new MonacoWebpackPlugin({
            languages: ['css']
        }),
    ]
};