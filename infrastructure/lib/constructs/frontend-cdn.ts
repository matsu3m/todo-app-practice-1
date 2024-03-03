import { CloudFrontToS3 } from "@aws-solutions-constructs/aws-cloudfront-s3";
import { aws_cloudfront, aws_cloudfront_origins, aws_s3_deployment } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthLambda } from "./auth-lambda";
import { BackendApi } from "./backend-api";

type Props = {
  backendApi: BackendApi;
  authLambda: AuthLambda;
  apiKey: string;
};

export class FrontendCdn extends Construct {
  public readonly distribution: aws_cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const apiGatewayOriginRequestPolicy = new aws_cloudfront.OriginRequestPolicy(
      this,
      "ApiGatewayOriginRequestPolicy",
      {
        cookieBehavior: aws_cloudfront.OriginRequestCookieBehavior.allowList(
          "CognitoIdentityServiceProvider.*.idToken",
        ),
      },
    );

    const additionalBehaviors: aws_cloudfront.BehaviorOptions = {
      origin: new aws_cloudfront_origins.RestApiOrigin(props.backendApi.apiGateway, {
        originPath: "",
        customHeaders: { Referer: props.apiKey },
      }),
      allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: apiGatewayOriginRequestPolicy,
      viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      edgeLambdas: [
        {
          functionVersion: props.authLambda.version,
          eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
        },
      ],
    };

    // L2 が OAC 未対応。L1 を利用すると冗長になるため　AWS Solutions Constructs　を利用
    const { cloudFrontWebDistribution, s3Bucket } = new CloudFrontToS3(this, "CloudFrontToS3", {
      cloudFrontDistributionProps: {
        additionalBehaviors: { "/api/*": additionalBehaviors },
        defaultBehavior: {
          edgeLambdas: [
            {
              functionVersion: props.authLambda.version,
              eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            },
          ],
        },
      },
      insertHttpSecurityHeaders: false,
    });

    if (s3Bucket === undefined) {
      throw new Error("S3Bucket is undefined");
    }

    new aws_s3_deployment.BucketDeployment(this, "BucketDeployment", {
      sources: [aws_s3_deployment.Source.asset("../frontend/dist")], // 事前にビルドが必要
      destinationBucket: s3Bucket,
      distribution: cloudFrontWebDistribution,
    });

    this.distribution = cloudFrontWebDistribution;
  }
}
