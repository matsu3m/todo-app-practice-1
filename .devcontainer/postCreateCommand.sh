#/bin/bash

sudo chown vscode ./node_modules ./frontend/node_modules ./infrastructure/node_modules ./auth/node_modules ./backend/.venv

npm install

cd ./frontend
npm install
cd ..

cd ./infrastructure
npm install
cd ..

cd ./auth
npm install
cd ..

cd ./backend
poetry config virtualenvs.in-project true
poetry install --no-root
cd ..

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
unzip /tmp/awscliv2.zip -d /tmp
sudo /tmp/aws/install

TABLE_EXISTS=$(aws dynamodb list-tables --endpoint-url http://dynamodb-dev:8000 | grep "ToDoTable")
if [ -z "$TABLE_EXISTS" ]; then
    bash ./.devcontainer/setupDb.sh
fi
