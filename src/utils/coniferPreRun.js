const fs = require('fs');
const { findAllTests } = require('./coniferGlob');
const { putNewTestFileInDynamo } = require('./DynamoDB/put-item-dynamoDB');

const preRunSetup = async () => {
  const files = await findAllTests();
  
  // test run ID needs to come from somewhere
  const testRunID = fs.readFileSync('./conifer/test-run-id.txt', 'utf-8');

  // for each file, upload the file dnto dynamoDB with status of to be executed
  files.forEach(file => {
    putNewTestFileInDynamo(file, testRunID);
  });
};

preRunSetup();

module.exports = { preRunSetup };
