import pytest
from fastapi.testclient import TestClient
from mypy_boto3_dynamodb import DynamoDBClient

from src.config import get_settings
from src.database import get_db_client
from src.main import app
from tests.database import get_test_db_client

settings = get_settings()
table_name = settings.table_name
test_db_client: DynamoDBClient = get_test_db_client()  # type: ignore


app.dependency_overrides[get_db_client] = get_test_db_client
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    test_db_client.create_table(
        TableName=table_name,
        KeySchema=[
            {
                "AttributeName": "id",
                "KeyType": "HASH",
            },
        ],
        AttributeDefinitions=[
            {"AttributeName": "id", "AttributeType": "S"},
        ],
        ProvisionedThroughput={"ReadCapacityUnits": 1, "WriteCapacityUnits": 1},
    )
    test_db_client.get_waiter("table_exists").wait(TableName=table_name)

    yield

    test_db_client.delete_table(TableName=table_name)


def add_todo_item(id: str, title: str, content: str, dueDate: str, status: str):
    test_db_client.put_item(
        TableName=table_name,
        Item={
            "id": {"S": id},
            "title": {"S": title},
            "content": {"S": content},
            "dueDate": {"S": dueDate},
            "status": {"S": status},
        },
    )


def test_get_all_todo_items():

    todo_1 = {"id": "1", "title": "Test ToDo 1", "content": "Content 1", "dueDate": "2023-01-01", "status": "pending"}
    todo_2 = {"id": "2", "title": "Test ToDo 2", "content": "Content 2", "dueDate": "2023-01-02", "status": "completed"}

    add_todo_item(**todo_1)
    add_todo_item(**todo_2)

    response = client.get("/todos")
    todos = response.json()

    assert response.status_code == 200
    assert len(todos) == 2
    print(todo_1)
    print(todos[0])
    assert todo_1 == todos[0]
    assert todo_2 == todos[1]
