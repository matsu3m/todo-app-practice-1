from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class BaseSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ToDoRead(BaseSchema):
    id: str = Field(description="ToDo を一意に識別するための ID", examples=["0caa59c1-17f7-404d-94f7-e44fccdaaa41"])
    title: str = Field(description="ToDo のタイトル", examples=["ToDo title"])
    description: str = Field(description="ToDo の詳細", examples=["ToDo description"])
    due_date: str = Field(description="ToDo の期日", examples=["2050-12-31"])
    status: Literal["backlog", "upcoming", "inProgress", "completed"] = Field(
        description="ToDo のステータス", examples=["backlog"]
    )


class ToDoCreate(BaseSchema):
    title: str = Field(description="ToDo のタイトル", min_length=1, max_length=100, examples=["ToDo title"])
    description: str = Field("", description="ToDo の詳細", max_length=1000, examples=["ToDo description"])
    due_date: str = Field("", description="ToDo の期日", pattern="^\\d{4}-\\d{2}-\\d{2}$", examples=["2050-12-31"])
    status: Literal["backlog", "upcoming", "inProgress", "completed"] = Field(
        "backlog", description="ToDo のステータス", examples=["backlog"]
    )


class ToDoUpdate(BaseSchema):
    title: str = Field(description="ToDo のタイトル", min_length=1, max_length=100, examples=["ToDo title"])
    description: str = Field(description="ToDo の詳細", max_length=1000, examples=["ToDo description"])
    due_date: str = Field(description="ToDo の期日", pattern="^\\d{4}-\\d{2}-\\d{2}$", examples=["2050-12-31"])
    status: Literal["backlog", "upcoming", "inProgress", "completed"] = Field(
        description="ToDo のステータス", examples=["backlog"]
    )


class Detail(BaseModel):
    detail: str = Field(description="エラーの詳細", examples=["Error detail"])
