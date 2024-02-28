from typing import Literal

from pydantic import BaseModel, Field


def to_camel(string: str) -> str:
    return "".join(word.capitalize() if i else word for i, word in enumerate(string.split("_")))


class ToDoRead(BaseModel):
    id: str = Field(description="todo を一意に識別するための ID")
    title: str = Field(description="todo のタイトル")
    description: str = Field(description="todo の詳細")
    due_date: str = Field(description="todo の期日")
    status: Literal["backlog", "upcoming", "in_progress", "completed"] = Field(description="todo のステータス")

    class Config:
        alias_generator = to_camel
