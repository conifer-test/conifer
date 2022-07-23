const fs = require('fs');
const { execSync } = require('child_process');
const {
  CONIFER_LOCAL_DIRECTORY,
  parseConfig,
  CONIFER_CONFIG_FILE,
} = require('./coniferConfig');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;
const cdkOutputs = JSON.parse(fs.readFileSync(CDK_OUTPUTS_PATH));


const downloadLastRunS3 = () => {
  const bucketName = cdkOutputs.ConiferCdkStack.bucketName;
  console.log('Downloading all reports in the last run');
  execSync(`aws s3 sync s3://${bucketName} ./coniferJSONReports`);
};

module.exports = downloadLastRunS3;