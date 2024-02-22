#/bin/bash

sudo chown vscode ./node_modules ./frontend/node_modules ./backend/.venv

npm install

cd ./frontend
npm install
cd ..

cd ./backend
poetry config virtualenvs.in-project true
poetry install --no-root
cd ..
