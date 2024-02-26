import { RemovalPolicy, aws_dynamodb } from "aws-cdk-lib";
import { Construct } from "constructs";

export class DbTable extends Construct {
  public readonly table: aws_dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new aws_dynamodb.Table(this, "Table", {
      partitionKey: { name: "id", type: aws_dynamodb.AttributeType.STRING },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY, // テスト用
    });
  }
}
