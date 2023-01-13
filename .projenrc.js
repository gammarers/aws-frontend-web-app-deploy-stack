const { awscdk } = require('projen');

const PROJECT_NAME = '@yicr/frontend-web-app-deploy-stack';
const PROJECT_DESCRIPTION = 'AWS CloudFront distribution for frontend web app (spa) optimized.';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.43.0',
  defaultReleaseBranch: 'main',
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  keywords: ['aws', 'cdk', 'cloudfront', 'cdn', 'web', 'spa', 'deploy'],
  repositoryUrl: 'https://github.com/yicr/frontend-web-app-deploy-stack.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();