from fastapi import FastAPI
from mangum import Mangum

from src.core.config import get_settings
from src.todo.routers import todo_router

settings = get_settings()

if settings == "prod":
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
else:
    app = FastAPI()


app.include_router(todo_router)


@app.get("/health/")
async def health_check():
    return {"status": "ok"}


handler = Mangum(app, lifespan="off")


def print_openapi_spec():
    print(app.openapi())
