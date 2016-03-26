#/bin/sh
set -e

cd /app/client
npm install -g bower node-gyp gulp
npm install
gulp compile

cd /app/server
npm install
