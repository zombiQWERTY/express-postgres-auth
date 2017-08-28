#!/usr/bin/env bash

cd $HOME/apps/iqlang-backend
npm run compile

cross-env NODE_ENV=production pm2 reload IQLang
