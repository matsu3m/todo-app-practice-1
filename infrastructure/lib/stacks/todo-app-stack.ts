import { App, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { randomBytes } from "crypto";
import { AuthLambda } from "../constructs/auth-lambda";
import { BackendApi } from "../constructs/backend-api";
import { DbTable } from "../constructs/db-table";
import { FrontendCdn } from "../constructs/frontend-cdn";

export class ToDoAppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dbTable = new DbTable(this, "DbTable");

    // TODO: 毎回 API Gateway と CloudFront に更新が入ってしまう点が微妙かもしれない
    const apiKey = randomBytes(64).toString("hex");

    const backendApi = new BackendApi(this, "BackendApi", { dbTable: dbTable.table, apiKey });

    const authLambda = new AuthLambda(this, "AuthLambda");

    const frontendCdn = new FrontendCdn(this, "FrontendCdn", { backendApi, authLambda, apiKey });

    new CfnOutput(this, "DistributionDomainName", {
      value: frontendCdn.distribution.distributionDomainName,
      exportName: "DistributionDomainName",
    });
  }
}
