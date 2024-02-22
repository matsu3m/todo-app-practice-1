FROM python:3.12.2-slim-bullseye AS backend-builder

WORKDIR /usr/src/app

RUN pip install --upgrade pip
RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock /usr/src/app/

RUN poetry export --without-hashes -f requirements.txt --output ./requirements.txt


FROM  public.ecr.aws/lambda/python:3.12

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=backend-builder /usr/src/app/requirements.txt ${LAMBDA_TASK_ROOT}

RUN pip install --no-cache-dir --upgrade -r ${LAMBDA_TASK_ROOT}/requirements.txt

COPY ./src/ ${LAMBDA_TASK_ROOT}/src/

CMD ["src.main.handler"]
