import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.189.1',
  typescriptVersion: '5.7.x',
  jsiiVersion: '5.7.x',
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  name: '@gammarers/aws-frontend-web-app-deploy-stack',
  description: 'This is an AWS CDK Construct to make deploying a Frontend Web App (SPA) deploy to S3 behind CloudFront.',
  keywords: ['aws', 'cdk', 'cloudfront', 'cdn', 'web', 'spa', 'deploy'],
  repositoryUrl: 'https://github.com/gammarers/aws-frontend-web-app-deploy-stack.git',
  npmAccess: javascript.NpmAccess.PUBLIC,
  majorVersion: 2,
  deps: [
    '@gammarers/aws-secure-frontend-web-app-cloudfront-distribution@^2.0.2',
    '@gammarers/aws-secure-bucket@^2.3.3',
  ],
  devDeps: [
    '@gammarers/jest-aws-cdk-asset-filename-renamer@^0.5.8',
  ],
  peerDeps: [
  ],
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '22.x',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 19 * * 2']), // every tuesday 19:00 (JST/WED:0300)
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@gammarers/jest-aws-cdk-asset-filename-renamer'],
    },
  },
  publishToPypi: {
    distName: 'gammarers.aws-frontend-web-app-deploy-stack',
    module: 'gammarers.aws_frontend_web_app_deploy_stack',
  },
  publishToNuget: {
    dotNetNamespace: 'Gammarers.CDK.AWS',
    packageId: 'Gammarers.CDK.AWS.FrontendWebAppDeployStack',
  },
});
project.synth();