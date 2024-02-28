from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class BaseSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ToDoRead(BaseSchema):
    id: str = Field(description="todo を一意に識別するための ID")
    title: str = Field(description="todo のタイトル")
    description: str = Field(description="todo の詳細")
    due_date: str = Field(description="todo の期日")
    status: Literal["backlog", "upcoming", "in_progress", "completed"] = Field(description="todo のステータス")


class ToDoCreate(BaseSchema):
    title: str = Field(description="todo のタイトル")
    description: str = Field(default="", description="todo の詳細")
    due_date: str = Field(default="", description="todo の期日")
    status: Literal["backlog", "upcoming", "in_progress", "completed"] = Field(
        default="backlog", description="todo のステータス"
    )
