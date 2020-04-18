import * as Cdk from '@aws-cdk/core'
import * as S3 from '@aws-cdk/aws-s3'

const PROJECT = 'frontend'

export class FrontendStack extends Cdk.Stack {
  constructor(scope: Cdk.Construct, id: string, props?: Cdk.StackProps) {
    super(scope, id, props)

    const bucket = new S3.Bucket(this, PROJECT, {
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: Cdk.RemovalPolicy.DESTROY,
    })
  }
}
