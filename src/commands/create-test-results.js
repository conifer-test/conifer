const chalk = require('chalk');

const deleteTestRunS3 = require('../utils/delete-test-run-S3');
const downloadTestRunS3 = require('../utils/download-test-run-S3');
const createTestRunResults = require('../utils/create-test-run-result-script');

const generateTestResults = () => {
  console.log('Wait and receive info that test is completed');

  downloadTestRunS3();
  deleteTestRunS3();
  createTestRunResults();
};

module.exports = async () => {
  console.log(`${chalk.cyan('Generating your parallel test results now...')}`);
  generateTestResults();
};
