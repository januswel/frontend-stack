import * as CDK from '@aws-cdk/core'
import * as S3 from '@aws-cdk/aws-s3'
import * as CloudFront from '@aws-cdk/aws-cloudfront'

const PROJECT = 'frontend'

export class FrontendStack extends CDK.Stack {
  constructor(scope: CDK.Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props)

    const appBucket = new S3.Bucket(this, `${PROJECT}-bucket`, {
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: CDK.RemovalPolicy.DESTROY,
    })

    const oai = new CloudFront.OriginAccessIdentity(this, `${PROJECT}-oai`)

    const distribution = new CloudFront.CloudFrontWebDistribution(this, `${PROJECT}-distribution`, {
      priceClass: CloudFront.PriceClass.PRICE_CLASS_200,
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
    })
  }
}
