const { execSync } = require('child_process');

const downloadLastRunS3 = () => {
  const bucketName = 'ainaa-manual-test-bucket';
  console.log('Downloading all reports in the last run');
  execSync(`aws s3 sync s3://${bucketName} ./coniferJSONReports`);
};

module.exports = downloadLastRunS3;