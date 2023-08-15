# AWS Frontend Web App Deploy Stack

This is an AWS CDK Construct to make deploying a Frontend Web App (SPA) deploy to S3 behind CloudFront.

## Install

### TypeScript

```shell
npm install @gammarer/aws-frontend-web-app-deploy-stack
# or
yarn add @gammarer/aws-frontend-web-app-deploy-stack
```

### Python

```shell
pip install gammarer.aws-frontend-web-app-deploy-stack
```

### Java

Add the following to pom.xml:

```xml
<dependency>
  <groupId>com.gammarer</groupId>
  <artifactId>aws-frontend-web-app-deploy-stack</artifactId>
</dependency>
```

## Example

```typescript
import { FrontendWebAppDeployStack } from '@gammarer/aws-frontend-web-app-deploy-stack';

new FrontendWebAppDeployStack(app, 'FrontendWebAppDeployStack', {
  env: { account: '012345678901', region: 'us-east-1' },
  domainName: 'example.com',
  hostedZoneId: 'Z0000000000000000000Q',
  originBucketName: 'frontend-web-app-example-origin-bucket', // new create in this stack
  deploySourceAssetPath: 'website/',
  logBucketArn: 'arn:aws:s3:::frontend-web-app-example-access-log-bucket', // already created
});

```

## License

This project is licensed under the Apache-2.0 License.