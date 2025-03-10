# Link: https://jacekkozlowski.com
## Tech stack:
    - Typescript/Javascript
    - HTML/CSS
    - TailwindCSS
    - React/NextJS
    - AWS & AWS CDK
        - Lambda
        - Lambda Layer
        - DynamoDB
        - Route53
        - Cognito
        - S3
    - AWS SDK v3
    - NPM/Monorepo using workspaces
    - shadcn/ui for components

Push infrastructure changes:
```
npm run cdk:deploy
```
build frontend for public use (creating a production build):
```
npm run frontend:build
```
running app on localhost
```
npm run frontend:dev
```