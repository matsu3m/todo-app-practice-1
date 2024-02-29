aws dynamodb create-table \
  --table-name ToDoTable \
  --attribute-definitions AttributeName=user_id,AttributeType=S AttributeName=id,AttributeType=S \
  --key-schema AttributeName=user_id,KeyType=HASH AttributeName=id,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --endpoint-url http://dynamodb-dev:8000

aws dynamodb put-item \
  --table-name ToDoTable \
  --item '{
      "user_id": {"S": "local-user"},
      "id": {"S": "0caa59c1-17f7-404d-94f7-e44fccdaaa41"},
      "title": {"S": "ToDo1"},
      "description": {"S": "Description 1"},
      "due_date": {"S": "2024-03-01"},
      "status": {"S": "completed"}
  }' \
  --endpoint-url http://dynamodb-dev:8000

aws dynamodb put-item \
  --table-name ToDoTable \
  --item '{
      "user_id": {"S": "local-user"},
      "id": {"S": "992ea102-3d1c-4bf8-b5a7-425947021339"},
      "title": {"S": "ToDo2"},
      "description": {"S": "Description 2"},
      "due_date": {"S": "2024-03-02"},
      "status": {"S": "upcoming"}
  }' \
  --endpoint-url http://dynamodb-dev:8000

aws dynamodb put-item \
  --table-name ToDoTable \
  --item '{
      "user_id": {"S": "local-user"},
      "id": {"S": "20ed9b53-7626-4f25-a194-b482efa56b6a"},
      "title": {"S": "ToDo3"},
      "description": {"S": "Description 3"},
      "due_date": {"S": "2024-03-03"},
      "status": {"S": "backlog"}
  }' \
  --endpoint-url http://dynamodb-dev:8000

aws dynamodb put-item \
  --table-name ToDoTable \
  --item '{
      "user_id": {"S": "other-user"},
      "id": {"S": "20ed9b53-7626-4f25-a194-b482efa56b6a"},
      "title": {"S": "Invisible ToDo"},
      "description": {"S": "Invisible ToDo"},
      "due_date": {"S": "2024-03-01"},
      "status": {"S": "backlog"}
  }' \
  --endpoint-url http://dynamodb-dev:8000
