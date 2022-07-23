const fs = require('fs');
const { execSync } = require('child_process');
const {
  CONIFER_LOCAL_DIRECTORY,
  parseConfig,
  CONIFER_CONFIG_FILE,
} = require('./coniferConfig');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;

const deleteLastRunS3 = () => {
  const cdkOutputs = JSON.parse(fs.readFileSync(CDK_OUTPUTS_PATH));
  const bucketName = cdkOutputs.ConiferCdkStack.bucketName;
  console.log('Deleting last test run files in S3');
  execSync(`aws s3 rm s3://${bucketName}/ --recursive `)
};

module.exports = deleteLastRunS3;