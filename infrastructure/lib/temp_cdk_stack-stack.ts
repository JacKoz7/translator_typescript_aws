import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";

// Chapter 4 - CDK explained (two constructors and buckets)

// class ImageGallery extends Construct {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id);

//     new s3.Bucket(this, "OriginalSizeImageBucket", {
//       versioned: true,
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       autoDeleteObjects: true,
//     });

//     new s3.Bucket(this, "ThumbnailSizeImageBucket", {
//       versioned: true,
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       autoDeleteObjects: true,
//     });
//   }
// }

// class PhotoManagment extends Construct {
//   //konstruktor
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id);
//     new ImageGallery(this, "photoAlbumGallery");
//   }
// }

export class TempCdkStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectRoot = "../"; //one folder up
    const lambdasDirPath = path.join(projectRoot, "packages/lambdas");

    //dynamoDB construct here
    const table = new dynamodb.Table(this, "translations", {
      tableName: "translations",
      partitionKey: {
        name: "requestId",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // a policy attached to lambda
    // allowing it to access translation resource
    //translate access policy
    const translateServicePolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    // the same thing as table.grantReadWriteData(lambdaFunc); but for official deployment
    const translateTablePolicy = new iam.PolicyStatement({
      actions: [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
      ],
      resources: ["*"],
    });

    const translateLambdaPath = path.resolve(
      path.join(lambdasDirPath, "translate/index.ts")
    );

    // top level api gateway construct
    const restApi = new apigateway.RestApi(this, "timeOfDayRestAPI");

    // lambda function that performs translations
    const translateLambda = new lambdaNodeJs.NodejsFunction(
      this,
      "translateLambda",
      {
        entry: translateLambdaPath,
        handler: "translate",
        runtime: lambda.Runtime.NODEJS_22_X,
        initialPolicy: [translateServicePolicy, translateTablePolicy],
        environment: {
          TRANSLATION_TABLE_NAME: table.tableName,
          TRANSLATION_PARTITION_KEY: "requestId",
        },
      }
    );

    restApi.root.addMethod(
      "POST",
      new apigateway.LambdaIntegration(translateLambda)
    );

    // get translations lambda
    const getTranslationsLambda = new lambdaNodeJs.NodejsFunction(
      this,
      "getTranslationsLambda",
      {
        entry: translateLambdaPath,
        handler: "getTranslations",
        runtime: lambda.Runtime.NODEJS_22_X,
        initialPolicy: [translateTablePolicy],
        environment: {
          TRANSLATION_TABLE_NAME: table.tableName,
          TRANSLATION_PARTITION_KEY: "requestId",
        },
      }
    );

    restApi.root.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getTranslationsLambda)
    );

    // granting read and write access to the dynamodb table
    // has all permissions (not only 4)
    // table.grantReadWriteData(lambdaFunc);
  }
}
