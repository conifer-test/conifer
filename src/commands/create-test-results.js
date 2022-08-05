const chalk = require('chalk');

const deleteTestRunS3 = require('../utils/delete-test-run-S3');
const downloadTestRunS3 = require('../utils/download-test-run-S3');
const createTestRunResults = require('../utils/create-test-run-result-script');

const generateTestResults = async () => {
  console.log('Wait and receive info that test is completed');
  console.log(`${chalk.cyan('Generating your parallel test results now...')}`);

  await downloadTestRunS3();
  // deleteTestRunS3();
  await createTestRunResults();
};

module.exports = {
  generateTestResults
};
