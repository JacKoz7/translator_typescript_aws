import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";

export interface IUserAuthSupportServiceProps extends cdk.StackProps {}

export class UserAuthSupportService extends Construct {
  userPool: cognito.UserPool
  constructor(scope: Construct, id: string, props?: IUserAuthSupportServiceProps) {
    super(scope, id);

    this.userPool = new cognito.UserPool(this, "TranslatorUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      "TranslatorUserPoolClient",
      {
        userPool: this.userPool,
        userPoolClientName: "Translator-web-client",
        generateSecret: false,
        // we can add more ways for users to log in instead COGNITO we can use for ex. GOOGLE or APPLE
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
      }
    );

    new cdk.CfnOutput(this, "userPoolId", {
      value: this.userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "userPoolClient", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
