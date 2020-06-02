import * as CDK from '@aws-cdk/core'
import * as S3 from '@aws-cdk/aws-s3'
import * as Route53 from '@aws-cdk/aws-route53'
import * as CertificateManager from '@aws-cdk/aws-certificatemanager'
import * as CloudFront from '@aws-cdk/aws-cloudfront'
import * as Route53Targets from '@aws-cdk/aws-route53-targets/lib'

const DOMAIN = 'spa-sample.januswel.com'

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

    const zone = new Route53.PublicHostedZone(this, 'hosted-zone', {
      zoneName: DOMAIN,
    })
    const certificate = new CertificateManager.DnsValidatedCertificate(this, 'certificate', {
      domainName: DOMAIN,
      hostedZone: zone,
      region: 'us-east-1',
    })

    const oai = new CloudFront.OriginAccessIdentity(this, 'origin-access-identity')

    const distribution = new CloudFront.CloudFrontWebDistribution(this, 'distribution', {
      priceClass: CloudFront.PriceClass.PRICE_CLASS_200,
      aliasConfiguration: {
        acmCertRef: certificate.certificateArn,
        names: [DOMAIN],
        sslMethod: CloudFront.SSLMethod.SNI,
        securityPolicy: CloudFront.SecurityPolicyProtocol.TLS_V1_2_2018,
      },
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

    new Route53.ARecord(this, 'alias-record', {
      recordName: DOMAIN,
      target: Route53.RecordTarget.fromAlias(new Route53Targets.CloudFrontTarget(distribution)),
      zone,
    })

    new CDK.CfnOutput(this, 'bucket-name', {
      value: appBucket.bucketName,
    })
    new CDK.CfnOutput(this, 'URL', {
      value: `https://${DOMAIN}`,
    })
  }
}
