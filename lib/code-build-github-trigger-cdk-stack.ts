import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as logs from 'aws-cdk-lib/aws-logs';

export class CodeBuildGithubTriggerCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubOwnerName = new cdk.CfnParameter(this, 'githubOwnerName', {
      type: 'String',
    });
    const githubRepoName = new cdk.CfnParameter(this, 'githubRepoName', {
      type: 'String',
    });

    const githubSource = codebuild.Source.gitHub({
      owner: githubOwnerName.valueAsString,
      repo: githubRepoName.valueAsString,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH)
          .andBranchIsNot('main')
          .andBranchIsNot('develop')
          .andTagIsNot('.*'),
      ],
    });

    const logGroup = new logs.LogGroup(this, 'UnitTestProjectLogsGroup', {
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const buildProject = new codebuild.Project(this, 'UnitTestProject', {
      source: githubSource,
      buildSpec: codebuild.BuildSpec.fromSourceFilename('ci/code-build/buildspec.yml'),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_6_0,
        computeType: codebuild.ComputeType.SMALL,
        privileged: true,
      },
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER, codebuild.LocalCacheMode.SOURCE),
      logging: {
        cloudWatch: { enabled: true, logGroup },
      },
      timeout: cdk.Duration.minutes(5),
    });
  }
}
