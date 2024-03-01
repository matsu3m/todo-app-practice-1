from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.core.auth import get_current_user
from src.todo.exceptions import DatabasePermissionDeniedException, DatabasePrimaryKeyViolationException
from src.todo.repositories import ToDoRepository
from src.todo.schemas import Detail, ToDoCreate, ToDoRead, ToDoUpdate

todo_router = APIRouter(
    prefix="/todos", responses={status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized Error", "model": Detail}}
)


@todo_router.get(
    "/",
    response_model=List[ToDoRead],
    status_code=status.HTTP_200_OK,
    description="自身が作成した全ての ToDo を取得する",
)
def get_all_todos(user_id: str = Depends(get_current_user), repository: ToDoRepository = Depends(ToDoRepository)):
    todos = repository.find_by_user_id(user_id)
    return todos


@todo_router.post(
    "/",
    response_model=ToDoRead,
    status_code=status.HTTP_201_CREATED,
    description="新しい ToDo を作成する",
    responses={status.HTTP_409_CONFLICT: {"description": "Conflict Error", "model": Detail}},
)
def create_todo(
    todo: ToDoCreate, user_id: str = Depends(get_current_user), repository: ToDoRepository = Depends(ToDoRepository)
):
    try:
        created_todo = repository.create(user_id, todo)
        return created_todo
    except DatabasePrimaryKeyViolationException:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Database primary key violation")


@todo_router.put(
    "/{todo_id}",
    response_model=ToDoRead,
    status_code=status.HTTP_200_OK,
    description="自身が作成した ToDo を指定して更新する（すべての項目を上書き）",
    responses={status.HTTP_403_FORBIDDEN: {"description": "Forbidden Error", "model": Detail}},
)
def update_todo(
    todo_id: str,
    todo: ToDoUpdate,
    user_id: str = Depends(get_current_user),
    repository: ToDoRepository = Depends(ToDoRepository),
):
    try:
        updated_todo = repository.upsert(user_id, todo_id, todo)
        return updated_todo
    except DatabasePermissionDeniedException:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Database permission denied")


@todo_router.delete(
    "/{todo_id}", status_code=status.HTTP_204_NO_CONTENT, description="自身が作成した ToDo を指定して削除する"
)
def delete_todo(
    todo_id: str, user_id: str = Depends(get_current_user), repository: ToDoRepository = Depends(ToDoRepository)
):
    repository.delete(user_id, todo_id)
    return
