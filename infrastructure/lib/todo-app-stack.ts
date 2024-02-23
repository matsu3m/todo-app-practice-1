import * as cdk from "aws-cdk-lib";
import { aws_apigateway, aws_dynamodb, aws_lambda } from "aws-cdk-lib";

export class ToDoAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new aws_dynamodb.Table(this, "Table", {
      partitionKey: { name: "id", type: aws_dynamodb.AttributeType.STRING },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // テスト用
    });

    const lambda = new aws_lambda.DockerImageFunction(this, "Lambda", {
      code: aws_lambda.DockerImageCode.fromImageAsset("../backend"),
      environment: {
        ENV: "prod",
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(lambda);

    const apiGateway = new aws_apigateway.RestApi(this, "APIGateway", { deployOptions: { stageName: "api" } });

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda, { proxy: true });

    const resource = apiGateway.root.addResource("{proxy+}");
    resource.addMethod("ANY", lambdaIntegration);
  }
}
