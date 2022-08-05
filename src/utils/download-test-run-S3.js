const fs = require('fs');
const {
  CONIFER_LOCAL_DIRECTORY,
} = require('./coniferConfig');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;
const ora = require('ora');
const spinner = ora({ color: 'green' });
const { execute } = require('./promisify');


const downloadLastRunS3 = async () => {
  const cdkOutputs = JSON.parse(fs.readFileSync(CDK_OUTPUTS_PATH));
  const bucketName = cdkOutputs.ConiferCdkStack.bucketName;

  spinner.start('Downloading all reports in the last run');
  await execute(`aws s3 sync s3://${bucketName} ./coniferJSONReports`);
  spinner.succeed('Results downloaded successfully');
};

module.exports = downloadLastRunS3;