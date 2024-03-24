#! /bin/sh

RIMRAF="node_modules/rimraf/dist/esm/bin.mjs"

$RIMRAF dist/
$RIMRAF esm/
$RIMRAF index.js
$RIMRAF index.d.ts
$RIMRAF options.js
$RIMRAF options.d.ts