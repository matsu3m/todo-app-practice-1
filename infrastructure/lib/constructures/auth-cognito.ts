import { RemovalPolicy, aws_cognito } from "aws-cdk-lib";
import { Construct } from "constructs";

type Props = {
  callbackUrlDomain?: string;
};

export class AuthCognito extends Construct {
  public readonly userPool: aws_cognito.UserPool;
  public readonly userPoolClient: aws_cognito.UserPoolClient;
  public readonly userPoolDomain: aws_cognito.UserPoolDomain;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const userPool = new aws_cognito.UserPool(this, "CognitoUserPool", {
      removalPolicy: RemovalPolicy.DESTROY, // テスト用
    });

    const userPoolClient = new aws_cognito.UserPoolClient(this, "CognitoUserPoolClient", {
      userPool,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        callbackUrls: props.callbackUrlDomain ? [`https://${props.callbackUrlDomain}`] : undefined, // callbackUrl が指定されていない場合 (= 初期構築時) は指定せず、後から更新
      },
    });

    const userPoolDomain = new aws_cognito.UserPoolDomain(this, "CognitoUserPoolDomain", {
      userPool,
      cognitoDomain: {
        domainPrefix: `todo-app-${userPoolClient.userPoolClientId}`, // 一意な値が欲しいだけの理由で userPoolClientId を使っている
      },
    });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.userPoolDomain = userPoolDomain;
  }
}
