import uuid

from fastapi import Depends
from mypy_boto3_dynamodb.client import DynamoDBClient

from src.core.config import Settings, get_settings
from src.core.database import deserialize_items, get_db_client, serialize_item
from src.todo.models import ToDoCreate, ToDoUpdate


class ToDoRepository:
    def __init__(self, db_client: DynamoDBClient = Depends(get_db_client), settings: Settings = Depends(get_settings)):
        self.db_client = db_client
        self.table_name = settings.table_name

    def find_all(self):
        response = self.db_client.scan(TableName=self.table_name)
        items = response.get("Items", [])
        return deserialize_items(items)

    def create(self, todo: ToDoCreate):
        id = str(uuid.uuid4())
        item = {"id": id, **todo.model_dump()}
        self.db_client.put_item(TableName=self.table_name, Item=serialize_item(item))
        return item

    def update(self, id: str, todo: ToDoUpdate):
        item = {"id": id, **todo.model_dump()}
        self.db_client.put_item(TableName=self.table_name, Item=serialize_item(item))
        return item

    def delete(self, id: str):
        self.db_client.delete_item(TableName=self.table_name, Key={"id": {"S": id}})
