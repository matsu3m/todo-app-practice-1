from typing import List

from fastapi import APIRouter, Depends

from src.todo.models import ToDo
from src.todo.repositories import ToDoRepository

todo_router = APIRouter(prefix="/todos")


@todo_router.get("/", response_model=List[ToDo], description="全ての ToDo を取得する")
def get_all_todos(repository: ToDoRepository = Depends(ToDoRepository)):
    return repository.findAll()
