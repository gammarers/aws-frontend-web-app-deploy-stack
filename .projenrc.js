const { awscdk, javascript } = require('projen');

const PROJECT_NAME = '@yicr/frontend-web-app-deploy-stack';
const PROJECT_DESCRIPTION = 'This is an AWS CDK Construct to make deploying a Frontend Web App (SPA) deploy to S3 behind CloudFront.';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.43.0',
  defaultReleaseBranch: 'main',
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  keywords: ['aws', 'cdk', 'cloudfront', 'cdn', 'web', 'spa', 'deploy'],
  repositoryUrl: 'https://github.com/yicr/frontend-web-app-deploy-stack.git',
  npmAccess: javascript.NpmAccess.PUBLIC,
  deps: [
    '@yicr/secure-cloudfront-origin-bucket@0.1.0',
    '@yicr/secure-frontend-web-app-cloudfront-distribution@0.2.0',
  ],
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();