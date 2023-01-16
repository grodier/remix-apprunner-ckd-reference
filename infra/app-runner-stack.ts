import * as cdk from "aws-cdk-lib";
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import * as assets from "aws-cdk-lib/aws-ecr-assets";
import * as path from "node:path";

const rootDir = path.resolve(process.cwd());
console.log("ROOTDIR: ", rootDir);
class RemixDeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const remixDockerImage = new assets.DockerImageAsset(this, "RemixImage", {
      directory: rootDir,
    });

    const remixAppRunner = new apprunner.Service(this, "RemixAppRunner", {
      source: apprunner.Source.fromAsset({
        imageConfiguration: {
          port: 3000,
        },
        asset: remixDockerImage,
      }),
    });

    new cdk.CfnOutput(this, "AppRunnerUrl", {
      value: remixAppRunner.serviceUrl,
    });
  }
}

const app = new cdk.App();
new RemixDeployStack(app, "RemixDeployStack", {});
