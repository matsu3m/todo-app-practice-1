import * as cdk from "aws-cdk-lib";

type Props = cdk.StackProps & {
  callbackUrl: string;
};

export class CognitoStack extends cdk.Stack {
  public readonly cognitoUserPoolClient: cdk.aws_cognito.UserPoolClient;

  constructor(scope: cdk.App, id: string, props: Props) {
    super(scope, id, props);

    const cognitoUserPool = new cdk.aws_cognito.UserPool(this, "CognitoUserPool", {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // テスト用
    });

    const cognitoUserPoolClient = new cdk.aws_cognito.UserPoolClient(this, "CognitoUserPoolClient", {
      userPool: cognitoUserPool,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        callbackUrls: props.callbackUrl ? [props.callbackUrl] : undefined,
      },
    });

    const cognitoUserPoolDomain = new cdk.aws_cognito.UserPoolDomain(this, "CognitoUserPoolDomain", {
      userPool: cognitoUserPool,
      cognitoDomain: {
        domainPrefix: `todo-app-${cognitoUserPoolClient.userPoolClientId}`, // 一意な値が欲しいだけの理由で userPoolClientId を使っている
      },
    });

    this.cognitoUserPoolClient = cognitoUserPoolClient;

    new cdk.CfnOutput(this, "CognitoUserPoolId", {
      value: cognitoUserPool.userPoolId,
      exportName: "CognitoUserPoolId",
    });
    new cdk.CfnOutput(this, "CognitoUserPoolClientId", {
      value: cognitoUserPoolClient.userPoolClientId,
      exportName: "CognitoUserPoolClientId",
    });
    new cdk.CfnOutput(this, "CognitoUserPoolDomainName", {
      value: cognitoUserPoolDomain.domainName,
      exportName: "CognitoUserPoolDomainName",
    });

    if (props.callbackUrl) {
      new cdk.CfnOutput(this, "CallbackUrl", {
        value: props.callbackUrl,
        exportName: "CallbackUrl",
      });
    }
  }
}
