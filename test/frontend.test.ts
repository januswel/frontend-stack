import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import Frontend = require('../lib/frontend-stack')

describe('Frontend Stack', () => {
  it('has S3 bucket', () => {
    const app = new cdk.App()
    const stack = new Frontend.FrontendStack(app, 'MyTestStack')

    expectCDK(stack).to(
      haveResource('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      }),
    )
  })
})
