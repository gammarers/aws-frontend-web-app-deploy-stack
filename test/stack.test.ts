import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { FrontendWebAppDeployStack } from '../src';

describe('FrontendWebAppDeployStack Testing', () => {
  let template: Template;

  // Create template.
  beforeAll(() => {
    const app = new cdk.App();
    const stack = new FrontendWebAppDeployStack(app, 'FrontendWebAppDeployStack', {
      env: { account: '012345678901', region: 'us-east-1' },
      domainName: 'example.com',
      hostedZoneId: 'Z0000000000000000000Q',
      originBucketName: 'frontend-web-app-example-origin-bucket',
      deploySourceAssetPath: 'website/',
      logBucketArn: 'arn:aws:s3:::frontend-web-app-example-access-log-bucket',
    });
    template = Template.fromStack(stack);
  });

  it('Has Origin Bucket', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'frontend-web-app-example-origin-bucket',
    });
  });

  it('Allow from CloudFront Origin Access Identity', () => {
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: Match.stringLikeRegexp('SecureCloudFrontOriginBucket'),
      },
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([
          Match.objectEquals({
            Action: 's3:GetObject',
            Effect: 'Allow',
            Principal: {
              Service: 'cloudfront.amazonaws.com',
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      Match.stringLikeRegexp('SecureCloudFrontOriginBucket'),
                      'Arn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
            Condition: {
              StringEquals: {
                'AWS:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':cloudfront::',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':distribution/',
                      {
                        Ref: Match.stringLikeRegexp('SecureFrontendWebAppCloudFrontDistribution'),
                      },
                    ],
                  ],
                },
              },
            },
          }),
        ]),
      },
    });
  });

  it('Has Certificate', () => {
    template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: 'example.com',
      DomainValidationOptions: Match.arrayEquals([
        {
          DomainName: 'example.com',
          HostedZoneId: 'Z0000000000000000000Q',
        },
      ]),
      ValidationMethod: 'DNS',
    });
  });

  it('Has CloudFront Distribution', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', Match.objectLike({
      DistributionConfig: {
        Aliases: [
          'example.com',
        ],
      },
    }));
  });

  it('Has DNS Record', () => {
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'example.com.',
      Type: 'A',
      AliasTarget: Match.objectLike({
        DNSName: {},
        HostedZoneId: {},
      }),
      HostedZoneId: 'Z0000000000000000000Q',
    });
  });

  it('Has S3 Deployment Custom Resource', () => {
    template.hasResource('Custom::CDKBucketDeployment', {});
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});