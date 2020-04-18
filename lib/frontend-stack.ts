import * as cdk from '@aws-cdk/core'

const PROJECT = 'frontend'

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
  }
}
