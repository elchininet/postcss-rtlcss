import path from 'node:path';
import aliases from './aliases.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export default {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        filename: 'scripts/index.js',
        path: path.resolve('../docs')
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
                exclude: /\.module\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: 'global'
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.module\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
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