import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.80.0',
  constructsVersion: '10.0.5',
  typescriptVersion: '5.1.x',
  jsiiVersion: '5.1.x',
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  name: '@gammarer/aws-frontend-web-app-deploy-stack',
  description: 'This is an AWS CDK Construct to make deploying a Frontend Web App (SPA) deploy to S3 behind CloudFront.',
  keywords: ['aws', 'cdk', 'cloudfront', 'cdn', 'web', 'spa', 'deploy'],
  repositoryUrl: 'https://github.com/gammarer/aws-frontend-web-app-deploy-stack.git',
  npmAccess: javascript.NpmAccess.PUBLIC,
  devDeps: [
    '@gammarer/jest-serializer-aws-cdk-asset-filename-replacer@0.3.x',
    '@gammarer/aws-secure-cloudfront-origin-bucket@~1.2.2',
    '@gammarer/aws-secure-frontend-web-app-cloudfront-distribution@~1.0.0',
    '@gammarer/aws-secure-bucket@~1.1.2',
  ],
  peerDeps: [
    '@gammarer/aws-secure-cloudfront-origin-bucket@~1.2.2',
    '@gammarer/aws-secure-frontend-web-app-cloudfront-distribution@~1.0.0',
    '@gammarer/aws-secure-bucket@~1.1.2',
  ],
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '20.11.0',
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
      snapshotSerializers: ['<rootDir>/node_modules/@gammarer/jest-serializer-aws-cdk-asset-filename-replacer'],
    },
  },
  publishToPypi: {
    distName: 'gammarer.aws-frontend-web-app-deploy-stack',
    module: 'gammarer.aws_frontend_web_app_deploy_stack',
  },
  publishToMaven: {
    mavenGroupId: 'com.gammarer',
    javaPackage: 'com.gammarer.cdk.aws.frontend_web_app_deploy_stack',
    mavenArtifactId: 'aws-frontend-web-app-deploy-stack',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
  publishToNuget: {
    dotNetNamespace: 'Gammarer.CDK.AWS',
    packageId: 'Gammarer.CDK.AWS.FrontendWebAppDeployStack',
  },
});
project.synth();