#! /bin/sh

mkdir esm

cp -a dist/. ./

## esm package
echo '{\n    "type": "module"\n}' > esm/package.json