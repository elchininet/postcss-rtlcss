#! /bin/sh

mkdir esm

## index
cp dist/index.js index.js
cp dist/esm/index.js esm/index.js

## options
cp dist/options.js options.js
cp dist/esm/options.js esm/options.js

## type definitions
cp dist/index.d.ts index.d.ts
cp dist/options.d.ts options.d.ts

## esm package
echo '{\n    "type": "module"\n}' > esm/package.json