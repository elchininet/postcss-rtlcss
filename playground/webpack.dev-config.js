import webpackConfig from './webpack.config.js';

export default {
    ...webpackConfig,
    mode: 'development',
    plugins: webpackConfig.plugins.splice(1),
    devServer: {
        host: '0.0.0.0',
        compress: true,
        port: 3000
    }
};