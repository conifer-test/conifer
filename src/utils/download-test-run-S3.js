const fs = require('fs');
const { execSync } = require('child_process');
const {
  CONIFER_LOCAL_DIRECTORY,
  parseConfig,
} = require('./coniferConfig');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;
const ora = require('ora');
const spinner = ora({ color: 'green' });


const downloadLastRunS3 = () => {
  const cdkOutputs = JSON.parse(fs.readFileSync(CDK_OUTPUTS_PATH));
  const bucketName = cdkOutputs.ConiferCdkStack.bucketName;
  const { testRunId } = parseConfig();


  spinner.start('Downloading all reports in the last run');
  execSync(`aws s3 sync s3://${bucketName}/${testRunId}/results ./coniferJSONReports`);
  spinner.succeed('Results downloaded successfully');
};

module.exports = downloadLastRunS3;