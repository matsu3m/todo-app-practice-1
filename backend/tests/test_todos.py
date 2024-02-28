import pytest
from fastapi.testclient import TestClient
from mypy_boto3_dynamodb import DynamoDBClient

from src.core.config import get_settings
from src.core.database import get_db_client
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


def add_todo_item(id: str, title: str, description: str, due_date: str, status: str):
    test_db_client.put_item(
        TableName=table_name,
        Item={
            "id": {"S": id},
            "title": {"S": title},
            "description": {"S": description},
            "dueDate": {"S": due_date},
            "status": {"S": status},
        },
    )


class TestGetAllTodos:
    def 全てのToDoが取得される(self):
        test_data = [
            {
                "id": "1",
                "title": "ToDo 1",
                "description": "Description 1",
                "dueDate": "2023-01-01",
                "status": "completed",
            },
            {
                "id": "2",
                "title": "ToDo 2",
                "description": "Description 2",
                "dueDate": "2023-01-02",
                "status": "in_progress",
            },
            {
                "id": "3",
                "title": "ToDo 3",
                "description": "Description 3",
                "dueDate": "2023-01-03",
                "status": "upcoming",
            },
            {
                "id": "4",
                "title": "ToDo 4",
                "description": "Description 4",
                "dueDate": "2023-01-04",
                "status": "backlog",
            },
        ]

        for item in test_data:
            add_todo_item(item["id"], item["title"], item["description"], item["dueDate"], item["status"])

        response = client.get("/todos")
        todos = response.json()

        assert response.status_code == 200
        assert len(todos) == 4
