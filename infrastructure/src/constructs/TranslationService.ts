import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import { RestApiService } from "./RestApiService";
import { createNodeJsLambda, lambdaLayersDirPath, lambdasDirPath } from "../helpers";

export interface ITranslationServiceProps extends cdk.StackProps {
  restApi: RestApiService;
}

export class TranslationService extends Construct {
  public restApi: apigateway.RestApi;
  constructor(
    scope: Construct,
    id: string,
    { restApi }: ITranslationServiceProps
  ) {
    super(scope, id);

    const utilsLambdaLayerPath = path.resolve(
      path.join(lambdaLayersDirPath, "utils-lambda-layer")
    );

    //dynamoDB construct here
    // create table
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
    // translate tabel access policy
    const translateTablePolicy = new iam.PolicyStatement({
      actions: [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
      ],
      resources: ["*"],
    });

    // lambda layer construct
    const utilsLambdaLayer = new lambda.LayerVersion(this, "utilsLambdaLayer", {
      code: lambda.Code.fromAsset(utilsLambdaLayerPath),
      compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // lambda function that performs translations
    const translateLambda = createNodeJsLambda(this, "translateLambda", {
      lambdaRelPath: "translate/index.ts",
      handler: "translate",
      initialPolicy: [translateServicePolicy, translateTablePolicy],
      lambdaLayers: [utilsLambdaLayer],
      environment: {
        TRANSLATION_TABLE_NAME: table.tableName,
        TRANSLATION_PARTITION_KEY: "requestId",
      },
    });

    // adding lambda to restApi
    restApi.addTranslateMethod({
      httpMethod: "POST",
      lambda: translateLambda,
    });

    // get translations lambda
    const getTranslationsLambda = createNodeJsLambda(this, "getTranslationsLambda", {
      lambdaRelPath: "translate/index.ts",
      handler: "getTranslations",
      initialPolicy: [translateTablePolicy],
      lambdaLayers: [utilsLambdaLayer],
      environment: {
        TRANSLATION_TABLE_NAME: table.tableName,
        TRANSLATION_PARTITION_KEY: "requestId",
      },
    });

    // adding the get translate to restApi
    restApi.addTranslateMethod({
      httpMethod: "GET",
      lambda: getTranslationsLambda,
    });
  }
}
