/** @type {import('postcss-load-config').Config} */

import path from 'node:path';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssNested from 'postcss-nested';
import postcssSimpleVars from 'postcss-simple-vars';

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

export default {
  plugins: [
    postcssImport({
      path: [
        path.resolve('src/styles')
      ]
    }),
    postcssMixins({
      mixins
    }),
    postcssNested,
    postcssSimpleVars,
    autoprefixer
  ]
};