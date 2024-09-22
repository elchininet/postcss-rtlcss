const webpackConfig = require('./webpack.config');

module.exports = {
    ...webpackConfig,
    mode: 'development',
    plugins: webpackConfig.plugins.splice(1),
    devServer: {
        host: '0.0.0.0',
        compress: true,
        port: 3000
    }
};