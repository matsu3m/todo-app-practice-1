from typing import List

from fastapi import APIRouter, Depends, status

from src.core.auth import get_current_user
from src.todo.models import Detail, ToDoCreate, ToDoRead, ToDoUpdate
from src.todo.repositories import ToDoRepository

todo_router = APIRouter(prefix="/todos", responses={401: {"description": "Authentication error", "model": Detail}})


@todo_router.get(
    "/",
    response_model=List[ToDoRead],
    status_code=status.HTTP_200_OK,
    description="全ての ToDo を取得する",
)
def get_all_todos(user_id: str = Depends(get_current_user), repository: ToDoRepository = Depends(ToDoRepository)):
    todos = repository.find_by_user_id(user_id)
    return todos


@todo_router.post(
    "/", response_model=ToDoRead, status_code=status.HTTP_201_CREATED, description="新しい ToDo を作成する"
)
def create_todo(
    todo: ToDoCreate, user_id: str = Depends(get_current_user), repository: ToDoRepository = Depends(ToDoRepository)
):
    created_todo = repository.create(user_id, todo)
    return created_todo


@todo_router.put(
    "/{todo_id}", response_model=ToDoRead, status_code=status.HTTP_200_OK, description="指定された ToDo を更新する"
)
def update_todo(
    todo_id: str,
    todo: ToDoUpdate,
    user_id: str = Depends(get_current_user),
    repository: ToDoRepository = Depends(ToDoRepository),
):
    updated_todo = repository.upsert(user_id, todo_id, todo)
    return updated_todo


@todo_router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT, description="指定された ToDo を削除する")
def delete_todo(
    todo_id: str, user_id: str = Depends(get_current_user), repository: ToDoRepository = Depends(ToDoRepository)
):
    repository.delete(user_id, todo_id)
    return
