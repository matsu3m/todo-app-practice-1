from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    env: Literal["local", "dev", "prod"] = "local"
    local_db_uri: str = "http://dynamodb-dev:8000"
    table_name: str = "ToDoTable"
    cognito_public_key: str = "cognito-public-key"
    cognito_user_pool_client_id: str = "cognito-user-pool-client-id"


def get_settings():
    return Settings()
