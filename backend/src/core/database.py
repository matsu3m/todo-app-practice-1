from typing import Any, Dict, List

import boto3
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer
from fastapi import Depends

from src.core.config import Settings, get_settings

serializer = TypeSerializer()
deserializer = TypeDeserializer()


def get_db_client(settings: Settings = Depends(get_settings)):
    return boto3.client("dynamodb", endpoint_url=settings.local_db_uri if settings.env == "local" else None)


def serialize_item(item: Dict[str, Any]):
    return {k: serializer.serialize(v) for k, v in item.items()}


def serialize_items(items: List[Dict[str, Any]]):
    return [serialize_item(item) for item in items]


def deserialize_item(item: Dict[str, Any]):
    return {k: deserializer.deserialize(v) for k, v in item.items()}


def deserialize_items(items: List[Dict[str, Any]]):
    return [deserialize_item(item) for item in items]
