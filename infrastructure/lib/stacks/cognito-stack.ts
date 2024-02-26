import { App, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AuthCognito } from "../constructures/auth-cognito";

type Props = StackProps & {
  callbackUrlDomain: string;
};

export class CognitoStack extends Stack {
  constructor(scope: App, id: string, props: Props) {
    super(scope, id, props);

    const authCognito = new AuthCognito(this, "AuthCognito", { callbackUrlDomain: props.callbackUrlDomain });

    new CfnOutput(this, "CognitoUserPoolId", {
      value: authCognito.userPool.userPoolId,
      exportName: "CognitoUserPoolId",
    });

    new CfnOutput(this, "CognitoUserPoolClientId", {
      value: authCognito.userPoolClient.userPoolClientId,
      exportName: "CognitoUserPoolClientId",
    });

    new CfnOutput(this, "CognitoUserPoolDomainName", {
      value: authCognito.userPoolDomain.domainName,
      exportName: "CognitoUserPoolDomainName",
    });

    if (props.callbackUrlDomain) {
      new CfnOutput(this, "CognitoCallbackUrlDomain", {
        value: props.callbackUrlDomain,
        exportName: "CognitoCallbackUrlDomain",
      });
    }
  }
}
