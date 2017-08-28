#!/usr/bin/env bash

cd $HOME/apps/iqlang-backend
./bin/start/compile.sh

cross-env NODE_ENV=production pm2 start ./dist/src/index.js --name="IQLang" -- --protocol=https --domain=iqlang.com --port=443 --startport=3000
