import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  CertificateWrapper,
  RestApiService,
  StaticWebsiteDeployment,
  UserAuthSupportService,
} from "../constructs";
import { TranslationService } from "../constructs/TranslationService";
import { getConfig } from "../helpers";

export class TranslatorServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const config = getConfig();
    console.log("config: ", config);

    const domain = config.domain;
    const webUrl = `${config.webSubdomain}.${domain}`;
    const apiUrl = `${config.apiSubdomain}.${domain}`;

    const cw = new CertificateWrapper(this, "CertificateWrapper", {
      domain,
      apiUrl,
      webUrl,
    });

    // user auth support
    const userAuth = new UserAuthSupportService(this, "UserAuthSupport")

    const restApi = new RestApiService(this, "restApiService", {
      apiUrl,
      certificate: cw.certificate,
      zone: cw.zone,
    });

    new TranslationService(this, "translationService", {
      restApi,
    });

    new StaticWebsiteDeployment(this, "StaticWebsiteDeployment", {
      certificate: cw.certificate,
      zone: cw.zone,
      domain,
      webUrl: webUrl,
    });
  }
}
