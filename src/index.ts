import { SecureCloudFrontOriginBucket, SecureCloudFrontOriginType } from '@gammarers/aws-secure-cloudfront-origin-bucket';
import { SecureFrontendWebAppCloudFrontDistribution, S3OriginAccessType } from '@gammarers/aws-secure-frontend-web-app-cloudfront-distribution';
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as alias from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface FrontendWebAppDeployStackProps extends cdk.StackProps {
  readonly domainName: string;
  readonly hostedZoneId: string;
  readonly originBucketName: string;
  readonly logBucketArn: string;
  readonly deploySourceAssetPath: string;
}

export class FrontendWebAppDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendWebAppDeployStackProps) {
    super(scope, id, props);

    // 👇Create CloudFront Origin Access Identity.
    const oai = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');

    // 👇Create Secure Cloud Front Origin Bucket
    const originBucket = new SecureCloudFrontOriginBucket(this, 'SecureCloudFrontOriginBucket', {
      bucketName: props.originBucketName,
      cloudFrontOriginType: SecureCloudFrontOriginType.ORIGIN_ACCESS_IDENTITY,
      cloudFrontOriginAccessIdentityS3CanonicalUserId: oai.cloudFrontOriginAccessIdentityS3CanonicalUserId,
    });

    // 👇Get Hosted Zone.
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.domainName,
    });

    // 👇Create Certificate with DNS validate.
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // 👇Secure Frontend Web App CloudFront Distribution.
    const distribution = new SecureFrontendWebAppCloudFrontDistribution(this, 'SecureFrontendWebAppCloudFrontDistribution', {
      comment: 'frontend web app distribution.',
      accessLogBucket: s3.Bucket.fromBucketArn(this, 'LogBucket', props.logBucketArn),
      certificate: certificate,
      domainName: props.domainName,
      s3OriginAccessType: S3OriginAccessType.ORIGIN_ACCESS_IDENTITY,
      originAccessIdentity: oai,
      originBucket: originBucket,
    });

    // 👇Route 53 DNS (Alias)
    new route53.ARecord(this, 'DNSARecord', {
      zone: hostedZone,
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(new alias.CloudFrontTarget(distribution)),
      ttl: cdk.Duration.seconds(300),
    });

    // 👇Deploy to Bucket with CloudFront Cache invalidate
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset(props.deploySourceAssetPath)],
      destinationBucket: originBucket,
      prune: true,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
