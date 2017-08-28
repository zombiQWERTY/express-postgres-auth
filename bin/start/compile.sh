#!/usr/bin/env bash

./node_modules/babel-cli/bin/babel.js ./src/ -d ./distForReplace/src
cp -r ./config ./distForReplace/config

./node_modules/rimraf/bin.js ./dist # For instant restart remove dist
mv ./distForReplace ./dist # And instantly mv distForReplace to dist
