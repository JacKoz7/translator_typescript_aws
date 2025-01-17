import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
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

    // a policy attached to lambda
    // allowing it to access translation resource
    const translateAccessPolicy = new iam.PolicyStatement({
      actions: ["translate:TranslateText"],
      resources: ["*"],
    });

    // the time of day lambda construct
    const lambdaFunc = new lambdaNodeJs.NodejsFunction(this, "timeOfday", {
      entry: "./lambda/timeOfday.ts",
      handler: "index",
      runtime: lambda.Runtime.NODEJS_22_X,
      initialPolicy: [translateAccessPolicy],
    });

    const restApi = new apigateway.RestApi(this, "timeOfdayRestAPI");
    restApi.root.addMethod(
      "POST",
      new apigateway.LambdaIntegration(lambdaFunc)
    );
  }
}
