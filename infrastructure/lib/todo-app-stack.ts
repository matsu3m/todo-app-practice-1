import { CloudFrontToS3 } from "@aws-solutions-constructs/aws-cloudfront-s3";
import * as cdk from "aws-cdk-lib";
import {
  aws_apigateway,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_dynamodb,
  aws_lambda,
  aws_s3_deployment,
} from "aws-cdk-lib";
import { calculateHashOfDirectory } from "../utils/hash";

export class ToDoAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaEdge = new aws_lambda.Function(this, "LambdaEdge", {
      handler: "index.handler",
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      code: aws_lambda.Code.fromAsset("../auth"),
    });

    const lambdaEdgeVersion = new aws_lambda.Version(this, "LambdaEdgeVersion", {
      lambda: lambdaEdge,
      description: calculateHashOfDirectory("../auth"),
    });

    const table = new aws_dynamodb.Table(this, "Table", {
      partitionKey: { name: "id", type: aws_dynamodb.AttributeType.STRING },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // テスト用
    });

    const lambda = new aws_lambda.DockerImageFunction(this, "Lambda", {
      code: aws_lambda.DockerImageCode.fromImageAsset("../backend"),
      environment: {
        ENV: "prod",
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(lambda);

    const apiGateway = new aws_apigateway.RestApi(this, "APIGateway", { deployOptions: { stageName: "api" } });

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda, { proxy: true });

    const resource = apiGateway.root.addResource("{proxy+}");
    resource.addMethod("ANY", lambdaIntegration);

    const additionalBehaviors: aws_cloudfront.BehaviorOptions = {
      origin: new aws_cloudfront_origins.RestApiOrigin(apiGateway, { originPath: "" }),
      allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
      viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      edgeLambdas: [
        {
          functionVersion: lambdaEdgeVersion,
          eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
        },
      ],
    };

    // L2 が OAC 未対応で冗長になるため　AWS Solutions Constructs　を利用
    const { cloudFrontWebDistribution, s3Bucket } = new CloudFrontToS3(this, "CloudFrontToS3", {
      cloudFrontDistributionProps: {
        additionalBehaviors: { "/api/*": additionalBehaviors },
        defaultBehavior: {
          edgeLambdas: [
            {
              functionVersion: lambdaEdgeVersion,
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

    new cdk.CfnOutput(this, "CloudFrontDomainName", {
      value: cloudFrontWebDistribution.distributionDomainName,
      exportName: "CloudFrontDomainName",
    });
  }
}
