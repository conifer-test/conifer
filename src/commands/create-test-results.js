const ora = require('ora');
const spinner = ora({
  color: 'green',
});

// const deleteTestRunS3 = require('../utils/delete-test-run-S3');
const downloadTestRunS3 = require('../utils/download-test-run-S3');
const createTestRunResults = require('../utils/create-test-run-result-script');

const generateTestResults = async () => {
  spinner.start('Downloading and generating your parallel test results...');

  await downloadTestRunS3();
  // deleteTestRunS3();
  await createTestRunResults();
  spinner.succeed('Test results downloaded and generated successfully');
};

module.exports = {
  generateTestResults,
};
