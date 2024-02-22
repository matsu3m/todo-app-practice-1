import boto3


def get_test_db_client():
    return boto3.client("dynamodb", endpoint_url="http://dynamodb-test:8000")
