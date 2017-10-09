#!/usr/bin/env bash

cd $HOME/apps/express-postgres-auth
cross-env NODE_ENV=production pm2 reload IQLang -f
