from typing import List

from fastapi import APIRouter, Depends, status

from src.todo.models import ToDoCreate, ToDoRead
from src.todo.repositories import ToDoRepository

todo_router = APIRouter(prefix="/todos")


@todo_router.get(
    "/", response_model=List[ToDoRead], status_code=status.HTTP_200_OK, description="全ての ToDo を取得する"
)
def get_all_todos(repository: ToDoRepository = Depends(ToDoRepository)):
    todos = repository.find_all()
    return todos


@todo_router.post(
    "/", response_model=ToDoRead, status_code=status.HTTP_201_CREATED, description="新しい ToDo を作成する"
)
def create_todo(todo: ToDoCreate, repository: ToDoRepository = Depends(ToDoRepository)):
    print(todo)
    created_todo = repository.save(todo)
    return created_todo
