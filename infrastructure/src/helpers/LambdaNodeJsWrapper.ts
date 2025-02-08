import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { lambdasDirPath } from "./AppPaths";
import path = require("path");
import * as fs from "fs";
import * as iam from "aws-cdk-lib/aws-iam";

export type IlambdaWrapperProps = {
  lambdaRelPath: string;
  handler: string;
  initialPolicy: Array<iam.PolicyStatement>;
  lambdaLayers: Array<lambda.ILayerVersion>;
  environment: Record<string, string>;
};

const bundling: lambdaNodeJs.BundlingOptions = {
  // reduce size of the code
  minify: true,
  externalModules: ["/opt/nodejs/utils-lambda-layer"],
};

export const createNodeJsLambda = (
  scope: Construct,
  lambdaName: string,
  {
    lambdaRelPath,
    handler,
    initialPolicy,
    lambdaLayers,
    environment,
  }: IlambdaWrapperProps
) => {
  const lambdaPath = path.join(lambdasDirPath, lambdaRelPath);
  if (!fs.existsSync(lambdaPath)) {
    throw new Error("Lambda path doesn't exist");
  }
  // lambda function that performs translations
  return new lambdaNodeJs.NodejsFunction(scope, lambdaName, {
    entry: lambdaPath,
    handler,
    runtime: lambda.Runtime.NODEJS_22_X,
    initialPolicy,
    layers: lambdaLayers,
    environment,
    bundling,
  });
};
