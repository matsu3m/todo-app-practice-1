import { aws_apigateway, aws_dynamodb, aws_lambda } from "aws-cdk-lib";
import { Construct } from "constructs";

type Props = { dbTable: aws_dynamodb.ITable };

export class BackendApi extends Construct {
  public readonly apiGateway: aws_apigateway.RestApi;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const lambda = new aws_lambda.DockerImageFunction(this, "Lambda", {
      code: aws_lambda.DockerImageCode.fromImageAsset("../backend"),
      environment: {
        ENV: "prod",
        TABLE_NAME: props.dbTable.tableName,
      },
    });

    props.dbTable.grantReadWriteData(lambda);

    const apiGateway = new aws_apigateway.RestApi(this, "APIGateway", { deployOptions: { stageName: "api" } });

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda, { proxy: true });

    const resource = apiGateway.root.addResource("{proxy+}");
    resource.addMethod("ANY", lambdaIntegration);

    this.apiGateway = apiGateway;
  }
}
