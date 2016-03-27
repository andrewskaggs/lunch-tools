#/bin/sh
set -e


echo "======> COMPILE APP"
cd /app/client
npm install -g bower node-gyp gulp
npm install
gulp clean
gulp bower 
gulp sass
gulp deploy

echo "======> COMPILE SERVER"
cd /app/server
npm install
