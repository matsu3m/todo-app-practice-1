import { App, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AuthLambda } from "../constructures/auth-lambda";
import { BackendApi } from "../constructures/backend-api";
import { DbTable } from "../constructures/db-table";
import { FrontendCdn } from "../constructures/frontend-cdn";

export class ToDoAppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const dbTable = new DbTable(this, "DbTable");

    const backendApi = new BackendApi(this, "BackendApi", { dbTable: dbTable.table });

    const authLambda = new AuthLambda(this, "AuthLambda");

    const frontendCdn = new FrontendCdn(this, "FrontendCdn", { backendApi, authLambda });

    new CfnOutput(this, "DistributionDomainName", {
      value: frontendCdn.distribution.distributionDomainName,
      exportName: "DistributionDomainName",
    });
  }
}
