const { execSync } = require('child_process');
const chalk = require('chalk');

const generateTestResults = () => {
  console.log('Test is running');
  console.log('Test is completed');

  const bucketName = 'ainaa-manual-test-bucket';
  // Download all the folder in the designated bucket
  console.log('Downloading all files in a bucket');
  execSync(`aws s3 sync s3://${bucketName} ./coniferJSONReports`);

  // Delete all the files in the designated bucket
  console.log('Deleting bucket');
  // execSync(`aws s3 rm s3://${bucketName}/ --recursive `)

  console.log('generate final mochawesome file');
  // merge the downloaded JSON files
  execSync('npx mochawesome-merge ./coniferJSONReports/*.json -o ./coniferJSONReports/output.json');
  
  // generate the mochawesome HTML
  execSync('npx mochawesome-report-generator marge ./coniferJSONReports/output.json');
};

module.exports = async () => {
  console.log(`${chalk.cyan('Creating your final test report now')}`);
  generateTestResults();
};