#/bin/bash

sudo chown vscode ./node_modules ./frontend/node_modules

npm install

cd ./frontend
npm install
cd ..
