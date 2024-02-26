import { aws_lambda } from "aws-cdk-lib";
import { Construct } from "constructs";
import { calculateHashOfDirectory } from "../../utils/hash";

export class AuthLambda extends Construct {
  public readonly version: aws_lambda.Version;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const lambda = new aws_lambda.Function(this, "LambdaEdge", {
      handler: "index.handler",
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      code: aws_lambda.Code.fromAsset("../auth"),
    });

    this.version = new aws_lambda.Version(this, "LambdaEdgeVersion", {
      lambda,
      description: calculateHashOfDirectory("../auth"),
    });
  }
}
