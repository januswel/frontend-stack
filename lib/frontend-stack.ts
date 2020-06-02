import * as CDK from '@aws-cdk/core'
import * as S3 from '@aws-cdk/aws-s3'
import * as CloudFront from '@aws-cdk/aws-cloudfront'

export class FrontendStack extends CDK.Stack {
  constructor(scope: CDK.Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props)

    const appBucket = new S3.Bucket(this, 'app-bucket', {
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: CDK.RemovalPolicy.DESTROY,
    })

    const logBucket = new S3.Bucket(this, 'log-bucket', {
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: CDK.RemovalPolicy.DESTROY,
    })

    const oai = new CloudFront.OriginAccessIdentity(this, 'oai')

    const distribution = new CloudFront.CloudFrontWebDistribution(this, 'distribution', {
      priceClass: CloudFront.PriceClass.PRICE_CLASS_200,
      loggingConfig: {
        bucket: logBucket,
        prefix: 'access-log/',
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: appBucket,
            originAccessIdentity: oai,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
          errorCachingMinTtl: 86400,
        },
      ],
    })
  }
}
