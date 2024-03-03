import { aws_apigateway, aws_dynamodb, aws_iam, aws_lambda } from "aws-cdk-lib";
import { Construct } from "constructs";

type Props = { dbTable: aws_dynamodb.ITable; apiKey: string };

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

    const apiGatewayPolicy = new aws_iam.PolicyDocument({
      statements: [
        new aws_iam.PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: ["execute-api:/*"],
          principals: [new aws_iam.AnyPrincipal()],
          effect: aws_iam.Effect.DENY,
          conditions: {
            StringNotEquals: {
              "aws:Referer": props.apiKey, // TODO: Referer の適切な使い方とは言えない。WAF 等で他のヘッダを対象に絞るべき？
            },
          },
        }),
        new aws_iam.PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: ["execute-api:/*"],
          principals: [new aws_iam.AnyPrincipal()],
          effect: aws_iam.Effect.ALLOW,
        }),
      ],
    });

    const apiGateway = new aws_apigateway.RestApi(this, "APIGateway", {
      deployOptions: { stageName: "api" },
      policy: apiGatewayPolicy,
    });

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda, { proxy: true });

    const resource = apiGateway.root.addResource("{proxy+}");
    resource.addMethod("ANY", lambdaIntegration);

    this.apiGateway = apiGateway;
  }
}
