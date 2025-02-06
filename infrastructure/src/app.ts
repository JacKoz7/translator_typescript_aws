#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TranslatorServiceStack } from "./stacks/TranslatorServiceStack";

const app = new cdk.App();
new TranslatorServiceStack(app, "TranslatorService", {
  env: { account: "061051215835", region: "us-east-1" },
});
