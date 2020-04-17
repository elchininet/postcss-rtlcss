const webpackConfig = require('./webpack.config');

module.exports = {
    ...webpackConfig,  
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        compress: true,
        port: 3000
    }
};