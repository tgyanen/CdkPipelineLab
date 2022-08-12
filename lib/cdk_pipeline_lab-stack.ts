import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage';

export class CdkPipelineLabStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('tgyanen/CdkPipelineLab', 'main', {
          connectionArn: 'arn:aws:codestar-connections:us-east-2:034490466543:connection/de64904f-3738-4c47-b2a1-98971f51e3be'
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    
    });
    pipeline.addStage(new MyPipelineAppStage(this, "CFN-East-Stack-Name", {
      env: { account: "034490466543", region: "us-east-1" }
    }));
    pipeline.addStage(new MyPipelineAppStage(this, "CFN-West-Stack-Name", {
      env: { account: "034490466543", region: "us-west-1" }
    }));
  }
}
