/** @type {import('postcss-load-config').Config} */

const path = require('path');

const mixins = {
  buildTransition(mixin, properties) {
    const params = '250ms ease-in-out'
    return {
      transition: properties
        .split(/ +/)
        .map(property => `${property.trim()} ${params}`)
        .join(', ')
    }
  }
};

module.exports = {
  plugins: [
    require("postcss-import")({
      path: [
        path.resolve(__dirname, 'src/styles')
      ]
    }),
    require('postcss-mixins')({
      mixins
    }),
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('autoprefixer')
  ]
};