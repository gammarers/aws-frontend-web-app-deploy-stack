import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { FrontendWebAppDeployStack } from '../src';

describe('FrontendWebAppDeployStack Testing', () => {

  const app = new cdk.App();
  const stack = new FrontendWebAppDeployStack(app, 'FrontendWebAppDeployStack', {
    env: { account: '012345678901', region: 'us-east-1' },
    domainName: 'example.com',
    hostedZoneId: 'Z0000000000000000000Q',
    originBucketName: 'frontend-web-app-example-origin-bucket',
    deploySourceAssetPath: 'website/',
    logBucketArn: 'arn:aws:s3:::frontend-web-app-example-access-log-bucket',
    cloudFrontOptions: {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    },
  });
  const template = Template.fromStack(stack);

  it('Has CloudFront Distribution', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', Match.objectLike({
      DistributionConfig: {
        Aliases: [
          'example.com',
        ],
      },
    }));
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});