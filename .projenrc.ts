import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.62.0',
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  name: '@gammarer/aws-frontend-web-app-deploy-stack',
  description: 'This is an AWS CDK Construct to make deploying a Frontend Web App (SPA) deploy to S3 behind CloudFront.',
  keywords: ['aws', 'cdk', 'cloudfront', 'cdn', 'web', 'spa', 'deploy'],
  repositoryUrl: 'https://github.com/yicr/aws-frontend-web-app-deploy-stack.git',
  npmAccess: javascript.NpmAccess.PUBLIC,
  deps: [
    '@gammarer/aws-secure-cloudfront-origin-bucket',
    '@gammarer/aws-secure-frontend-web-app-cloudfront-distribution',
  ],
  devDeps: [
    '@gammarer/jest-serializer-aws-cdk-asset-filename-replacer',
  ],
  peerDeps: [
    '@gammarer/aws-secure-cloudfront-origin-bucket',
    '@gammarer/aws-secure-bucket',
    '@gammarer/aws-secure-frontend-web-app-cloudfront-distribution',
  ],
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '16.19.1',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 19 * * *']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@gammarer/jest-serializer-aws-cdk-asset-filename-replacer'],
    },
  },
});
project.synth();