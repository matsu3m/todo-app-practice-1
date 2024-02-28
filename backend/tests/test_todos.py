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
            "due_date": {"S": due_date},
            "status": {"S": status},
        },
    )


class TestGetAllTodos:
    def test_全てのToDoが取得される(self):
        expected_response_payload = [
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
                "status": "inProgress",
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

        for item in expected_response_payload:
            add_todo_item(item["id"], item["title"], item["description"], item["dueDate"], item["status"])

        response = client.get("/todos")
        response_payload = response.json()

        assert response.status_code == 200
        assert len(response_payload) == 4


class TestCreateToDo:
    def test_ToDoが1件追加される(self):
        request_payload = {
            "title": "New ToDo",
            "description": "New Description",
            "dueDate": "2023-01-01",
            "status": "backlog",
        }

        response = client.post("/todos", json=request_payload)
        response_payload = response.json()

        inserted_todo = test_db_client.get_item(TableName=table_name, Key={"id": {"S": response_payload["id"]}}).get(
            "Item"
        )

        assert response.status_code == 201
        assert request_payload["title"] == response_payload["title"] == inserted_todo.get("title", {}).get("S", "")
        assert (
            request_payload["description"]
            == response_payload["description"]
            == inserted_todo.get("description", {}).get("S", "")
        )
        assert (
            request_payload["dueDate"] == response_payload["dueDate"] == inserted_todo.get("due_date", {}).get("S", "")
        )
        assert request_payload["status"] == response_payload["status"] == inserted_todo.get("status", {}).get("S", "")


class TestUpdateTodo:
    def test_ToDoが1件更新される(self):
        add_todo_item("1", "ToDo 1", "Description 1", "2023-01-01", "completed")

        request_payload = {
            "title": "Updated ToDo",
            "description": "Updated Description",
            "dueDate": "2023-01-01",
            "status": "inProgress",
        }

        response = client.put("/todos/1", json=request_payload)
        response_payload = response.json()

        updated_todo = test_db_client.get_item(TableName=table_name, Key={"id": {"S": "1"}}).get("Item")

        assert response.status_code == 200
        assert request_payload["title"] == response_payload["title"] == updated_todo.get("title", {}).get("S", "")
        assert (
            request_payload["description"]
            == response_payload["description"]
            == updated_todo.get("description", {}).get("S", "")
        )
        assert (
            request_payload["dueDate"] == response_payload["dueDate"] == updated_todo.get("due_date", {}).get("S", "")
        )
        assert request_payload["status"] == response_payload["status"] == updated_todo.get("status", {}).get("S", "")


class TestDeleteToDo:
    def test_ToDoが1件削除される(self):
        add_todo_item("1", "ToDo 1", "Description 1", "2023-01-01", "completed")

        response = client.delete("/todos/1")

        assert response.status_code == 204
        assert test_db_client.get_item(TableName=table_name, Key={"id": {"S": "1"}}).get("Item") is None
