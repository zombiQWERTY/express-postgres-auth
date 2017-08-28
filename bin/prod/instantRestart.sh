#!/usr/bin/env bash

cd $HOME/apps/iqlang-backend
cross-env NODE_ENV=production pm2 reload IQLang -f
