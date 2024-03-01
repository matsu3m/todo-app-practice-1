import uuid

from fastapi import Depends
from mypy_boto3_dynamodb.client import DynamoDBClient

from src.core.config import Settings, get_settings
from src.core.database import deserialize_items, get_db_client, serialize_item
from src.todo.exceptions import DatabasePrimaryKeyViolationException
from src.todo.schemas import ToDoCreate, ToDoUpdate


class ToDoRepository:
    def __init__(self, db_client: DynamoDBClient = Depends(get_db_client), settings: Settings = Depends(get_settings)):
        self.db_client = db_client
        self.table_name = settings.table_name

    def find_by_user_id(self, user_id: str):
        response = self.db_client.query(
            TableName=self.table_name,
            KeyConditionExpression="user_id = :user_id",
            ExpressionAttributeValues={":user_id": {"S": user_id}},
        )
        items = response.get("Items", [])
        return deserialize_items(items)

    def create(self, user_id: str, todo: ToDoCreate):
        todo_id = str(uuid.uuid4())
        item = {"user_id": user_id, "id": todo_id, **todo.model_dump()}

        try:
            self.db_client.put_item(
                TableName=self.table_name,
                Item=serialize_item(item),
                ConditionExpression="attribute_not_exists(user_id) AND attribute_not_exists(id)",
            )
            return item
        except self.db_client.exceptions.ConditionalCheckFailedException as e:
            raise DatabasePrimaryKeyViolationException() from e

    def upsert(self, user_id: str, todo_id: str, todo: ToDoUpdate):
        item = {"user_id": user_id, "id": todo_id, **todo.model_dump()}

        self.db_client.put_item(
            TableName=self.table_name, Item=serialize_item(item)
        )  # TODO: PUT なので冪等性を持たせているが、新規作成時に UUID 以外の ID を指定されることになり、あまり良くない。PATCH に変えるべきか？

        return item

    def delete(self, user_id: str, todo_id: str):
        self.db_client.delete_item(TableName=self.table_name, Key={"user_id": {"S": user_id}, "id": {"S": todo_id}})
