#/bin/sh
set -e

cd /app/client
npm install -g bower node-gyp gulp
npm install
gulp clean && gulp bower && gulp sass && gulp deploy

cd /app/server
npm install
