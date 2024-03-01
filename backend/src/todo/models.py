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
    status: Literal["backlog", "upcoming", "inProgress", "completed"] = Field(description="todo のステータス")


class ToDoCreate(BaseSchema):
    title: str = Field(description="todo のタイトル", min_length=1, max_length=100)
    description: str = Field("", description="todo の詳細", max_length=1000)
    due_date: str = Field("", description="todo の期日", pattern="^\\d{4}-\\d{2}-\\d{2}$")
    status: Literal["backlog", "upcoming", "inProgress", "completed"] = Field(
        "backlog", description="todo のステータス"
    )


class ToDoUpdate(BaseSchema):
    title: str = Field(description="todo のタイトル", min_length=1, max_length=100)
    description: str = Field(description="todo の詳細", max_length=1000)
    due_date: str = Field(description="todo の期日", pattern="^\\d{4}-\\d{2}-\\d{2}$")
    status: Literal["backlog", "upcoming", "inProgress", "completed"] = Field(description="todo のステータス")


class Detail(BaseModel):
    detail: str
