import { expect as expectCDK, countResourcesLike, haveResource, ABSENT } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import Frontend = require('../lib/frontend-stack')

const app = new cdk.App()
const stack = new Frontend.FrontendStack(app, 'MyTestStack')

describe('Frontend Stack', () => {
  it('has two S3 buckets', () => {
    expectCDK(stack).to(
      countResourcesLike('AWS::S3::Bucket', 2, {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      }),
    )
  })

  it('has a policy for app bucket', () => {
    expectCDK(stack).to(haveResource('AWS::S3::BucketPolicy'))
  })

  it('has a hosted zone', () => {
    expectCDK(stack).to(haveResource('AWS::Route53::HostedZone'))
  })

  it('has an origin access identity to allow accesses from CloudFront to S3', () => {
    expectCDK(stack).to(
      haveResource('AWS::CloudFront::CloudFrontOriginAccessIdentity', {
        CloudFrontOriginAccessIdentityConfig: {
          Comment: 'Allows CloudFront to reach the bucket',
        },
      }),
    )
  })

  it('has CloudFront', () => {
    expectCDK(stack).to(haveResource('AWS::CloudFront::Distribution'))
  })
})
