import boto3
from fastapi import Depends

from src.config import Settings, get_settings


def get_db_client(settings: Settings = Depends(get_settings)):
    return boto3.client("dynamodb", endpoint_url=settings.local_db_uri if settings.env == "local" else None)
