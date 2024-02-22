from fastapi import Depends, FastAPI
from mypy_boto3_dynamodb.client import DynamoDBClient

from src.config import Settings, get_settings
from src.database import deserialize_items, get_db_client

app = FastAPI()


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/todos")
def get_all_todo_items(db_client: DynamoDBClient = Depends(get_db_client), settings: Settings = Depends(get_settings)):
    response = db_client.scan(TableName=settings.table_name)
    items = response.get("Items", [])
    return deserialize_items(items)
