#! /bin/sh

mkdir esm

## index
cp dist/index.js index.js
cp dist/esm/index.js esm/index.js

# options
cp dist/options.js options.js
cp dist/esm/options.js esm/options.js

# esm package
cp package.esm.json esm/package.json