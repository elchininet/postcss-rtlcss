#! /bin/sh

RIMRAF="./node_modules/rimraf/bin.js"

$RIMRAF dist/
$RIMRAF esm/
$RIMRAF index.js
$RIMRAF index.d.ts
$RIMRAF options.js
$RIMRAF options.d.ts