// Plan of attack: after tasks have finished running
/*
1. Retrieve the results of the tests from the current test run from dynamoDb.
2. Sanitize the data, clean, transform ...
3. Then we feed it into the optimal test groupings algorithm
4. Once we have the groupings, we export them to the conifer-config file.
5. Revisit how those groupings will be incorporated.

Some potential issues to work out:
  - What happens when test files change?
  - What happens when test files are added?
  - What happens when test files are removed?

Default can be: reglob when that happens.
*/

// Imports - Packages

// Imports - Files
const { readFileSync, writeFileSync } = require('fs');
const {
  CONIFER_LOCAL_DIRECTORY,
  parseConfig,
  CONIFER_CONFIG_FILE,
} = require('./coniferConfig');
const CDK_OUTPUTS_PATH = `${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`;

const getItemsByTestRunID = require('./DynamoDB/getItemsByTestRunId');
const { allocateTestsFromObjects } = require('./optimalTestGroupings');

// 1. Retrieve the results of the tests from the current test run from dynamoDb.
/*
1. Gather the variables that we need to do so
  a. testRunId
2. Fetch the data
*/

const updateTestGroupings = async () => {
  const { testRunId, parallelInstances } = parseConfig();
  console.log('testRunId:', testRunId);

  const testRunData = await getItemsByTestRunID(testRunId);
  // console.log('testRunData:', testRunData);
  const testFileAllocations = allocateTestsFromObjects(testRunData, parallelInstances);
  const coniferConfigFile = JSON.parse(readFileSync(CONIFER_CONFIG_FILE));
  coniferConfigFile.testGroupings = testFileAllocations;
  writeFileSync(CONIFER_CONFIG_FILE, JSON.stringify(coniferConfigFile));
};

module.exports = updateTestGroupings;