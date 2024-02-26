# デプロイ・動作確認の手順 (ローカルから実行する場合)

1. `cdk bootstrap` 用の IAM ユーザを AWS Management Console にて作成する。必要なポリシーは以下の通り。

    ```
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "cloudformation:*",
            "ecr:*",
            "ssm:*",
            "s3:*",
            "iam:*"
          ],
          "Resource": "*"
        }
      ]
    }
    ```

2. 1 で作成した IAM ユーザのアクセスキーを AWS Management Console にて作成後、環境変数にセットする。

    ```bash
    export AWS_ACCESS_KEY_ID=<key-id>
    export AWS_SECRET_ACCESS_KEY=<secret-key>
    export AWS_DEFAULT_REGION=us-east-1
    ```


3. `cdk bootstrap` を実行する。

    ```bash
    npx cdk bootstrap aws://<account-id>/us-east-1
    ```

4. `cdk deploy` 用に、1 で作成した IAM ユーザの権限を AWS Management Console から変更する。必要なポリシーは以下の通り。

    ```
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AssumeCDKRoles",
          "Effect": "Allow",
          "Action": "sts:AssumeRole",
          "Resource": "*",
          "Condition": {
            "StringEquals": {
              "iam:ResourceTag/aws-cdk:bootstrap-role": [
                "image-publishing",
                "file-publishing",
                "deploy",
                "lookup"
              ]
            }
          }
        },
        {
          "Sid": "DescribeStacks",
          "Effect": "Allow",
          "Action": "cloudformation:DescribeStacks",
          "Resource": [
            "arn:aws:cloudformation:us-east-1:<account-id>:stack/CognitoStack/*",
            "arn:aws:cloudformation:us-east-1:<account-id>:stack/ToDoAppStack/*"
          ]
        }
      ]
    }
    ```

5. デプロイを実行する。

    ```bash
    bash deploy.sh
    ```

6. AWS Management Console から Cognito ユーザプールにユーザを追加する。

7. CloudFront ディストリビューションの URL にアクセスする。
