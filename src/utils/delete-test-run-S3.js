const { execSync } = require('child_process');

const deleteLastRunS3 = () => {
  const bucketName = 'ainaa-manual-test-bucket';
  console.log('Deleting last test run files in S3');
  // execSync(`aws s3 rm s3://${bucketName}/ --recursive `)
};

module.exports = deleteLastRunS3;