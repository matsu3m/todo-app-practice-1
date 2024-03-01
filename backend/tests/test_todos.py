import uuid
from unittest.mock import patch

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

test_id = "12345678-1234-5678-1234-567812345678"


@pytest.fixture(autouse=True)
def setup_db():
    test_db_client.create_table(
        TableName=table_name,
        KeySchema=[
            {
                "AttributeName": "user_id",
                "KeyType": "HASH",
            },
            {
                "AttributeName": "id",
                "KeyType": "RANGE",
            },
        ],
        AttributeDefinitions=[
            {"AttributeName": "user_id", "AttributeType": "S"},
            {"AttributeName": "id", "AttributeType": "S"},
        ],
        ProvisionedThroughput={"ReadCapacityUnits": 1, "WriteCapacityUnits": 1},
    )
    test_db_client.get_waiter("table_exists").wait(TableName=table_name)

    yield

    test_db_client.delete_table(TableName=table_name)


def add_todo_item(
    todo_id: str,
    title: str,
    description: str,
    due_date: str,
    status: str,
    user_id: str = "local-user",
):
    test_db_client.put_item(
        TableName=table_name,
        Item={
            "user_id": {"S": user_id},
            "id": {"S": todo_id},
            "title": {"S": title},
            "description": {"S": description},
            "due_date": {"S": due_date},
            "status": {"S": status},
        },
    )


class TestGetAllTodos:
    def test_自身が作成したToDoが全て取得され他ユーザのToDoは取得されない(self):
        expected_response_payload = [
            {
                "id": "00000000-0000-0000-0000-000000000001",
                "title": "ToDo 1",
                "description": "Description 1",
                "dueDate": "2023-01-01",
                "status": "completed",
            },
            {
                "id": "00000000-0000-0000-0000-000000000002",
                "title": "ToDo 2",
                "description": "Description 2",
                "dueDate": "2023-01-02",
                "status": "backlog",
            },
            {
                "id": "00000000-0000-0000-0000-000000000003",
                "title": "ToDo 3",
                "description": "Description 3",
                "dueDate": "2023-01-03",
                "status": "upcoming",
            },
            {
                "id": "00000000-0000-0000-0000-000000000004",
                "title": "ToDo 4",
                "description": "Description 4",
                "dueDate": "2023-01-04",
                "status": "backlog",
            },
        ]

        for item in expected_response_payload:
            add_todo_item(item["id"], item["title"], item["description"], item["dueDate"], item["status"])

        add_todo_item(
            "00000000-0000-0000-0000-000000000005", "ToDo 5", "Description 5", "2023-01-05", "completed", "other-user"
        )  # 他ユーザの ToDo

        response = client.get("/todos")
        response_payload = response.json()

        assert response.status_code == 200
        assert len(response_payload) == 4
        for item in expected_response_payload:
            assert item in response_payload


class TestCreateToDo:
    def test_ToDoが1件作成される(self):
        request_payload = {
            "title": "New ToDo",
            "description": "New Description",
            "dueDate": "2023-01-01",
            "status": "backlog",
        }

        response = client.post("/todos", json=request_payload)
        response_payload = response.json()

        inserted_todo = test_db_client.get_item(
            TableName=table_name, Key={"user_id": {"S": "local-user"}, "id": {"S": response_payload["id"]}}
        ).get("Item")

        assert response.status_code == 201
        assert inserted_todo.get("user_id", {}).get("S", "") == "local-user"
        assert response_payload["id"] == inserted_todo.get("id", {}).get("S", "")
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

    def test_ToDo作成時にUserIdとToDoIdの両方が重複した場合409エラーが返却される(self):
        request_payload = {
            "title": "New ToDo",
            "description": "New Description",
            "dueDate": "2023-01-01",
            "status": "backlog",
        }

        add_todo_item(test_id, "ToDo 1", "Description 1", "2023-01-01", "completed")

        with patch("uuid.uuid4") as mock_uuid:
            mock_uuid.return_value = uuid.UUID(test_id)

            response = client.post("/todos", json=request_payload)

        assert response.status_code == 409

    def test_ToDo作成時にUserIdのみ重複した場合は新規にToDoが作成される(self):
        request_payload = {
            "title": "New ToDo",
            "description": "New Description",
            "dueDate": "2023-01-01",
            "status": "backlog",
        }

        add_todo_item("00000000-0000-0000-0000-000000000001", "ToDo 1", "Description 1", "2023-01-01", "completed")

        response = client.post("/todos", json=request_payload)

        inserted_todos = test_db_client.query(
            TableName=table_name,
            KeyConditionExpression="user_id = :user_id",
            ExpressionAttributeValues={":user_id": {"S": "local-user"}},
        ).get("Items", [])

        assert response.status_code == 201
        assert len(inserted_todos) == 2

    def test_ToDo作成時にToDoIdのみ重複した場合は新規にToDoが作成される(self):
        request_payload = {
            "title": "New ToDo",
            "description": "New Description",
            "dueDate": "2023-01-01",
            "status": "backlog",
        }

        add_todo_item(test_id, "ToDo 1", "Description 1", "2023-01-01", "completed", "other-user")

        with patch("uuid.uuid4") as mock_uuid:
            mock_uuid.return_value = uuid.UUID(test_id)

            response = client.post("/todos", json=request_payload)

        all_todos = test_db_client.scan(TableName=table_name).get("Items", [])

        assert response.status_code == 201
        assert len(all_todos) == 2


class TestUpdateTodo:
    def test_自身が作成したToDoが1件更新される(self):
        add_todo_item(test_id, "ToDo 1", "Description 1", "2023-01-01", "completed")

        request_payload = {
            "title": "Updated ToDo",
            "description": "Updated Description",
            "dueDate": "2050-01-01",
            "status": "inProgress",
        }

        response = client.put(f"/todos/{test_id}", json=request_payload)
        response_payload = response.json()

        updated_todo = test_db_client.get_item(
            TableName=table_name, Key={"user_id": {"S": "local-user"}, "id": {"S": test_id}}
        ).get("Item")

        assert response.status_code == 200
        assert updated_todo.get("user_id", {}).get("S", "") == "local-user"
        assert test_id == response_payload["id"] == updated_todo.get("id", {}).get("S", "")
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

    def test_指定したToDoが存在しない場合に新規にToDoが1件作成される(self):
        request_payload = {
            "title": "New ToDo",
            "description": "New Description",
            "dueDate": "2023-01-01",
            "status": "backlog",
        }

        response = client.put(f"/todos/{test_id}", json=request_payload)
        response_payload = response.json()

        inserted_todo = test_db_client.get_item(
            TableName=table_name, Key={"user_id": {"S": "local-user"}, "id": {"S": response_payload["id"]}}
        ).get("Item")

        assert response.status_code == 200
        assert inserted_todo.get("user_id", {}).get("S", "") == "local-user"
        assert test_id == response_payload["id"] == inserted_todo.get("id", {}).get("S", "")
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


class TestDeleteToDo:
    def test_ToDoが1件削除される(self):
        add_todo_item(test_id, "ToDo 1", "Description 1", "2023-01-01", "completed")

        response = client.delete(f"/todos/{test_id}")

        assert response.status_code == 204
        assert (
            test_db_client.get_item(TableName=table_name, Key={"user_id": {"S": "local-user"}, "id": {"S": "1"}}).get(
                "Item"
            )
            is None
        )
