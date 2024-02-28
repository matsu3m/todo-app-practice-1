from fastapi import Depends
from mypy_boto3_dynamodb.client import DynamoDBClient

from src.core.config import Settings, get_settings
from src.core.database import deserialize_items, get_db_client


class ToDoRepository:
    def __init__(self, db_client: DynamoDBClient = Depends(get_db_client), settings: Settings = Depends(get_settings)):
        self.db_client = db_client
        self.table_name = settings.table_name

    def findAll(self):
        response = self.db_client.scan(TableName=self.table_name)
        items = response.get("Items", [])
        return deserialize_items(items)

    def save(self):
        return

    def delete(self):
        return
