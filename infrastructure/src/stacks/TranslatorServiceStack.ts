import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { RestApiService } from "../constructs";
import { TranslationService } from "../constructs/TranslationService";

export class TranslatorServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // project path
    const projectRoot = "../"; //one folder up
    const lambdasDirPath = path.join(projectRoot, "packages/lambdas");
    const lambdaLayersDirPath = path.join(
      projectRoot,
      "packages/lambda-layers"
    );
    const domain = "jacekkozlowski.com";
    const fullUrl = `www.${domain}`;
    const apiUrl = `api.${domain}`;

    // fetch route53 zone
    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: domain,
    });

    // create certificate
    const certificate = new acm.Certificate(this, "certificate", {
      domainName: domain,
      subjectAlternativeNames: [fullUrl, apiUrl],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    const restApi = new RestApiService(this, "restApiService", {
      apiUrl,
      certificate,
      zone,
    });

    const translateService = new TranslationService(this, "translationService", {
      lambdaLayersDirPath,
      lambdasDirPath,
      restApi
    })

    // viewer certificate
    const viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(
      certificate,
      {
        aliases: [domain, fullUrl],
      }
    );

    // bucket where website dist will reside
    const bucket = new s3.Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distro = new cloudfront.CloudFrontWebDistribution(
      this,
      "WebsiteCloudFrontDist",
      {
        viewerCertificate,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    // s3 construct to deploy the website content

    new s3deploy.BucketDeployment(this, "WebsiteDeploy", {
      destinationBucket: bucket,
      sources: [s3deploy.Source.asset("../apps/frontend/dist")],
      distribution: distro,
      distributionPaths: ["/*"],
    });

    new route53.ARecord(this, "route53Domain", {
      zone,
      recordName: domain,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(distro)
      ),
    });

    new route53.ARecord(this, "route53FullUrl", {
      zone,
      recordName: "www",
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(distro)
      ),
    });

    // new cdk.CfnOutput(this, "webUrl", {
    //   exportName: "webUrl",
    //   value: `https://${distro.distributionDomainName}`,
    // });

    // granting read and write access to the dynamodb table
    // has all permissions (not only 4)
    // table.grantReadWriteData(lambdaFunc);
  }
}
